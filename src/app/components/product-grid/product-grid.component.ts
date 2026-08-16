import {
  Component,
  inject,
  input,
  OnInit,
  OnDestroy,
  signal,
  effect,
  ChangeDetectorRef,
  ElementRef,
  viewChild,
  afterNextRender
} from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, RouterLink, NgTemplateOutlet],
  template: `
    <section id="product-list" class="max-w-7xl mx-auto px-4 sm:px-6 py-12">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold">
            @if (viewMode().startsWith('search:')) {
              Results for “{{ viewMode().slice(7) }}”
            } @else if (viewMode() === 'recommended') {
              Shop
            } @else {
              {{ sectionTitle(viewMode()) }}
            }
          </h2>
          <p class="text-zinc-500 text-sm mt-1">
            @if (viewMode() === 'recommended') {
              Recommended picks and shop by category
            } @else {
              {{ products().length }} of {{ totalCount() }} product{{ totalCount() === 1 ? '' : 's' }}
            }
          </p>
        </div>

        <!-- Density toggle: phones only -->
        <div class="flex sm:hidden items-center gap-2 self-start">
          <span class="text-xs text-zinc-500">View</span>
          <button
            type="button"
            (click)="columnsMode.set(1)"
            class="px-3 py-1.5 rounded-full text-xs font-semibold border transition"
            [class.bg-emerald-500]="columnsMode() === 1"
            [class.text-black]="columnsMode() === 1"
            [class.border-emerald-500]="columnsMode() === 1"
            [class.border-zinc-700]="columnsMode() !== 1"
            [class.text-zinc-300]="columnsMode() !== 1">
            1 per row
          </button>
          <button
            type="button"
            (click)="columnsMode.set(2)"
            class="px-3 py-1.5 rounded-full text-xs font-semibold border transition"
            [class.bg-emerald-500]="columnsMode() === 2"
            [class.text-black]="columnsMode() === 2"
            [class.border-emerald-500]="columnsMode() === 2"
            [class.border-zinc-700]="columnsMode() !== 2"
            [class.text-zinc-300]="columnsMode() !== 2">
            2 per row
          </button>
        </div>
      </div>

      @if (loading() && !hasAnyContent()) {
        <div class="text-center py-20 text-zinc-500">Loading products...</div>
      } @else if (!loading() && !hasAnyContent()) {
        <div class="text-center py-20 text-zinc-500">
          <p class="text-lg">No products found</p>
        </div>
      } @else if (viewMode() === 'recommended') {

        @if (recommended().length > 0) {
          <div class="mb-14">
            <div class="mb-4">
              <h3 class="text-xl sm:text-2xl font-bold">Recommended for you</h3>
              <p class="text-zinc-500 text-sm mt-1">Hand-picked products we think you’ll like.</p>
            </div>
            <ng-container *ngTemplateOutlet="listLayout; context: { $implicit: recommended() }"></ng-container>
          </div>
        }

        @for (section of homeSections(); track section.key) {
          @if (section.products.length > 0) {
            <div class="mb-14">
              <div class="mb-4">
                <h3 class="text-xl sm:text-2xl font-bold">{{ section.title }}</h3>
                @if (section.description) {
                  <p class="text-zinc-500 text-sm mt-1">{{ section.description }}</p>
                }
              </div>

              @if (section.layout === 'scroll') {
                <ng-container *ngTemplateOutlet="scrollLayout; context: { $implicit: section.products }"></ng-container>
              } @else {
                <ng-container *ngTemplateOutlet="listLayout; context: { $implicit: section.products }"></ng-container>
              }
            </div>
          }
        }

      } @else {

        @if (activeLayout() === 'scroll') {
          <ng-container *ngTemplateOutlet="scrollLayout; context: { $implicit: products() }"></ng-container>
        } @else {
          <ng-container *ngTemplateOutlet="listLayout; context: { $implicit: products() }"></ng-container>
        }

        <div #scrollSentinel class="h-10 w-full" aria-hidden="true"></div>

        @if (loadingMore()) {
          <div class="text-center py-8 text-zinc-500 text-sm">Loading more...</div>
        }
        @if (!hasMore() && products().length > 0 && !loading()) {
          <div class="text-center py-8 text-zinc-600 text-sm">You’ve reached the end</div>
        }
      }
    </section>

    <!-- LIST: 1/2 on phone, 2–3 tablet, 4 on desktop -->
    <ng-template #listLayout let-list>
      <div
        class="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        [class.grid-cols-1]="columnsMode() === 1"
        [class.grid-cols-2]="columnsMode() === 2">
        @for (product of list; track product.id) {
          <ng-container *ngTemplateOutlet="card; context: { $implicit: product }"></ng-container>
        }
      </div>
    </ng-template>

    <!-- SCROLL: horizontal (backend layout) -->
    <ng-template #scrollLayout let-list>
      <div class="relative">
        <div class="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none"></div>
        <div class="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none"></div>
        <div class="flex gap-3 sm:gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">
          @for (product of list; track product.id) {
            <div
              class="snap-start shrink-0 sm:w-56 lg:w-64"
              [class.w-[85%]]="columnsMode() === 1"
              [class.w-[46%]]="columnsMode() === 2">
              <ng-container *ngTemplateOutlet="card; context: { $implicit: product }"></ng-container>
            </div>
          }
        </div>
        <p class="text-[10px] text-zinc-600 mt-1.5 text-center sm:text-left sm:hidden">
          ← Swipe for more →
        </p>
      </div>
    </ng-template>

    <ng-template #card let-product>
      <div class="group h-full bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-emerald-500/50 transition-all duration-300">
        <a [routerLink]="['/product', product.id]" class="block">
          <div class="aspect-square overflow-hidden bg-zinc-800">
            <img
              [src]="product.image"
              [alt]="product.name"
              class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
              loading="lazy">
          </div>
        </a>
        <div class="p-3 sm:p-4">
          <a [routerLink]="['/product', product.id]">
            <p class="text-[10px] sm:text-xs uppercase tracking-wider text-emerald-400 mb-1">
              {{ categoryLabel(product.category) }}
            </p>
            <h3 class="font-semibold text-sm sm:text-base mb-1 line-clamp-1">{{ product.name }}</h3>
          </a>
          <p class="text-zinc-400 text-[11px] sm:text-xs mb-1 line-clamp-2">{{ product.description }}</p>
          <a
            [routerLink]="['/product', product.id]"
            class="text-[11px] sm:text-xs text-emerald-400 hover:underline mb-2 inline-block">
            Read more
          </a>
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span class="text-sm sm:text-lg font-bold">
                KSH {{ formatPrice(product.base_price || product.price) }}
              </span>
              @if (isInStock(product)) {
                <p class="text-[10px] sm:text-xs text-emerald-400 mt-0.5">In Stock</p>
              } @else {
                <p class="text-[10px] sm:text-xs text-red-400 mt-0.5">Sold Out</p>
              }
            </div>
            @if (!isInStock(product)) {
              <button type="button" disabled
                class="bg-zinc-700 text-zinc-400 font-semibold px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs cursor-not-allowed">
                Sold Out
              </button>
            } @else if (hasFlavors(product)) {
              <button
                type="button"
                (click)="openFlavorPicker(product); $event.stopPropagation()"
                class="bg-zinc-100 hover:bg-white text-black font-semibold px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs transition active:scale-95">
                Choose option
              </button>
            } @else {
              <button
                type="button"
                (click)="addToCart(product); $event.stopPropagation()"
                class="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs transition active:scale-95">
                Add to Cart
              </button>
            }
          </div>
        </div>
      </div>
    </ng-template>

    @if (showFlavorModal()) {
      <div
        class="fixed inset-0 bg-black/70 z-[80] flex items-center justify-center p-4"
        (click)="closeFlavorPicker()">
        <div
          class="bg-zinc-950 border border-zinc-700 rounded-2xl w-full max-w-sm max-h-[90vh] flex flex-col"
          (click)="$event.stopPropagation()">
          <div class="p-5 pb-0 shrink-0">
            <h3 class="text-lg font-bold mb-1">{{ selectedProduct()?.name }}</h3>
            <p class="text-zinc-400 text-sm mb-3">Choose your option</p>
          </div>
          <div class="px-5 shrink-0">
            <div class="h-40 sm:h-48 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3">
              <img
                [src]="selectedVariant()?.image || selectedProduct()?.image"
                [alt]="selectedVariant()?.flavor || selectedProduct()?.name"
                class="max-h-full max-w-full object-contain">
            </div>
          </div>
          <div class="flex-1 min-h-0 overflow-y-auto px-5 space-y-2 overscroll-contain">
            @for (v of availableVariants(); track v.id) {
              <button
                type="button"
                (click)="selectedVariant.set(v)"
                class="w-full text-left px-4 py-3 rounded-xl border transition flex gap-3 items-center"
                [class.border-emerald-500]="selectedVariant()?.id === v.id"
                [class.bg-emerald-500/10]="selectedVariant()?.id === v.id"
                [class.border-zinc-700]="selectedVariant()?.id !== v.id">
                @if (v.image) {
                  <img
                    [src]="v.image"
                    class="w-10 h-10 rounded-lg object-contain bg-zinc-800 shrink-0"
                    [alt]="v.flavor">
                }
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between gap-2">
                    <span class="font-medium truncate">{{ v.flavor }}</span>
                    <span class="text-emerald-400 font-semibold shrink-0">
                      KSH {{ formatPrice(v.price) }}
                    </span>
                  </div>
                  <p class="text-xs text-zinc-500 mt-1">{{ v.stock }} in stock</p>
                </div>
              </button>
            }
          </div>
          <div class="p-5 pt-4 shrink-0 border-t border-zinc-800 flex gap-3 bg-zinc-950">
            <button
              type="button"
              (click)="closeFlavorPicker()"
              class="flex-1 border border-zinc-700 hover:border-zinc-500 py-2.5 rounded-xl text-sm transition">
              Cancel
            </button>
            <button
              type="button"
              (click)="confirmFlavorAdd()"
              [disabled]="!selectedVariant()"
              class="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold py-2.5 rounded-xl text-sm transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ProductGridComponent implements OnInit, OnDestroy {
  private cart = inject(CartService);
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  selectedCategory = input<string>('');
  searchQuery = input<string>('');

  scrollSentinel = viewChild<ElementRef<HTMLDivElement>>('scrollSentinel');

  products = signal<any[]>([]);
  recommended = signal<any[]>([]);
  homeSections = signal<
    { key: string; title: string; description: string; layout: 'list' | 'scroll'; products: any[] }[]
  >([]);
  categories = signal<any[]>([]);

  loading = signal(true);
  loadingMore = signal(false);
  viewMode = signal<string>('recommended');

  /** Phones only: 1 or 2 columns */
  columnsMode = signal<1 | 2>(2);

  currentPage = signal(1);
  totalCount = signal(0);
  hasMore = signal(true);

  showFlavorModal = signal(false);
  selectedProduct = signal<any>(null);
  selectedVariant = signal<any>(null);

  private observer: IntersectionObserver | null = null;
  private lastCategory = '';
  private lastSearch = '';

  constructor() {
    effect(() => {
      const cat = this.selectedCategory() || '';
      const search = this.searchQuery()?.trim() || '';

      if (search) {
        if (search !== this.lastSearch) {
          this.lastSearch = search;
          this.lastCategory = '';
          this.loadSearch(search);
        }
        return;
      }

      const category = cat && cat !== 'all' ? cat : 'recommended';

      if (category !== this.lastCategory) {
        this.lastCategory = category;
        this.lastSearch = '';

        if (category === 'recommended') {
          this.loadHome();
        } else {
          this.loadCategory(category);
        }
      }
    });

    afterNextRender(() => this.setupIntersectionObserver());
  }

  ngOnInit() {
    this.loadCategories();
    if (!this.selectedCategory() && !this.searchQuery()?.trim()) {
      this.loadHome();
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.observer = null;
  }

  hasAnyContent(): boolean {
    if (this.viewMode() === 'recommended') {
      return (
        this.recommended().length > 0 ||
        this.homeSections().some(s => s.products.length > 0)
      );
    }
    return this.products().length > 0;
  }

  formatPrice(value: number | string | null | undefined): string {
    const n = Number(value ?? 0);
    if (Number.isNaN(n)) return '0';
    return n.toLocaleString('en-KE');
  }

  loadCategories() {
    this.api.getCategories().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : data?.results || [];
        this.categories.set(list);
        this.cdr.detectChanges();
      },
      error: () => this.categories.set([])
    });
  }

  loadHome() {
    this.loading.set(true);
    this.viewMode.set('recommended');
    this.products.set([]);
    this.recommended.set([]);
    this.homeSections.set([]);
    this.hasMore.set(false);

    const build = (all: any[], recommendedList: any[]) => {
      this.recommended.set(recommendedList);
      const cats = this.categories().filter(
        (c: any) => c.show_on_home !== false && c.is_active !== false
      );
      const sections = cats.map((c: any) => ({
        key: c.key,
        title: c.title || c.key,
        description: c.description || '',
        layout: (c.layout === 'scroll' ? 'scroll' : 'list') as 'list' | 'scroll',
        products: all.filter((p: any) => p.category === c.key)
      }));
      this.homeSections.set(sections);
      this.loading.set(false);
      this.cdr.detectChanges();
    };

    const run = () => {
      this.api.getProducts({ recommended: true, page: 1 }).subscribe({
        next: (rec) => {
          const recommendedList = rec.results || [];
          this.api.getProducts({ page: 1 }).subscribe({
            next: (res) => build(res.results || [], recommendedList),
            error: () => build([], recommendedList)
          });
        },
        error: () => {
          this.api.getProducts({ page: 1 }).subscribe({
            next: (res) => build(res.results || [], []),
            error: () => {
              this.loading.set(false);
              this.cdr.detectChanges();
            }
          });
        }
      });
    };

    if (this.categories().length === 0) {
      this.api.getCategories().subscribe({
        next: (data: any) => {
          const list = Array.isArray(data) ? data : data?.results || [];
          this.categories.set(list);
          run();
        },
        error: () => run()
      });
    } else {
      run();
    }
  }

  activeLayout(): 'list' | 'scroll' {
    const mode = this.viewMode();
    if (mode.startsWith('search:')) return 'list';
    const cat = this.categories().find((c: any) => c.key === mode);
    return cat?.layout === 'scroll' ? 'scroll' : 'list';
  }

  sectionTitle(key: string): string {
    const cat = this.categories().find((c: any) => c.key === key);
    return cat?.title || this.categoryLabel(key);
  }

  private setupIntersectionObserver() {
    this.observer?.disconnect();
    this.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (this.viewMode() === 'recommended') return;
        if (this.loading() || this.loadingMore() || !this.hasMore()) return;
        this.loadNextPage();
      },
      { root: null, rootMargin: '250px', threshold: 0 }
    );
    this.observeSentinel();
  }

  private observeSentinel() {
    const el = this.scrollSentinel()?.nativeElement;
    if (!el || !this.observer) return;
    this.observer.disconnect();
    this.observer.observe(el);
  }

  loadCategory(category: string) {
    this.resetAndLoad({ category }, category);
  }

  loadSearch(q: string) {
    this.resetAndLoad({ search: q }, 'search:' + q);
  }

  private resetAndLoad(
    params: { recommended?: boolean; category?: string; search?: string },
    mode: string
  ) {
    this.loading.set(true);
    this.loadingMore.set(false);
    this.viewMode.set(mode);
    this.currentPage.set(1);
    this.hasMore.set(true);
    this.products.set([]);
    this.homeSections.set([]);
    this.recommended.set([]);

    this.api.getProducts({ ...params, page: 1 }).subscribe({
      next: (res) => {
        this.products.set(res.results || []);
        this.totalCount.set(res.count || 0);
        this.hasMore.set(!!res.next);
        this.loading.set(false);
        this.cdr.detectChanges();
        this.observeSentinel();
        document.getElementById('product-list')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      },
      error: () => {
        this.loading.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  loadNextPage() {
    if (this.viewMode() === 'recommended') return;
    if (!this.hasMore() || this.loadingMore() || this.loading()) return;

    this.loadingMore.set(true);
    const nextPage = this.currentPage() + 1;
    const mode = this.viewMode();
    const params: any = { page: nextPage };

    if (mode.startsWith('search:')) {
      params.search = mode.slice(7);
    } else {
      params.category = mode;
    }

    this.api.getProducts(params).subscribe({
      next: (res) => {
        this.products.set([...this.products(), ...(res.results || [])]);
        this.currentPage.set(nextPage);
        this.hasMore.set(!!res.next);
        this.totalCount.set(res.count || this.totalCount());
        this.loadingMore.set(false);
        this.cdr.detectChanges();
        this.observeSentinel();
      },
      error: () => {
        this.loadingMore.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  reload() {
    const mode = this.viewMode();
    if (mode === 'recommended') this.loadHome();
    else if (mode.startsWith('search:')) this.loadSearch(mode.slice(7));
    else this.loadCategory(mode);
  }

  availableVariants = () => {
    const p = this.selectedProduct();
    if (!p?.variants) return [];
    return p.variants.filter(
      (v: any) => v.is_available !== false && Number(v.stock) > 0
    );
  };

  categoryLabel(category: string): string {
    const cat = this.categories().find((c: any) => c.key === category);
    if (cat?.title) return cat.title;
    const fallback: Record<string, string> = {
      vape: 'Vapes',
      eliquid: 'E-Liquids',
      bong: 'Bongs',
      rollingpaper: 'Rolling Papers',
      cigar: 'Cigars',
      accessory: 'Accessories'
    };
    return fallback[category] || category;
  }

  hasFlavors(product: any): boolean {
    const variants = product?.variants || [];
    return variants.some(
      (v: any) => v.is_available !== false && Number(v.stock) > 0
    );
  }

  isInStock(product: any): boolean {
    const variants = product?.variants || [];
    if (variants.length > 0) {
      return variants.some(
        (v: any) => v.is_available !== false && Number(v.stock) > 0
      );
    }
    return (
      product?.is_available !== false &&
      (Number(product?.stock) > 0 || product?.in_stock === true)
    );
  }

  openFlavorPicker(product: any) {
    this.selectedProduct.set(product);
    const available = (product.variants || []).filter(
      (v: any) => v.is_available && v.stock > 0
    );
    this.selectedVariant.set(available[0] || null);
    this.showFlavorModal.set(true);
    this.cdr.detectChanges();
  }

  closeFlavorPicker() {
    this.showFlavorModal.set(false);
    this.selectedProduct.set(null);
    this.selectedVariant.set(null);
    this.cdr.detectChanges();
  }

  confirmFlavorAdd() {
    const product = this.selectedProduct();
    const variant = this.selectedVariant();
    if (!product || !variant) return;
    if (variant.stock <= 0) {
      alert('This flavor is sold out');
      return;
    }
    this.cart.add({
      ...product,
      price: variant.price,
      flavor: variant.flavor,
      variantId: variant.id,
      maxStock: variant.stock,
      image: variant.image || product.image
    });
  }

  addToCart(product: any) {
    if (!this.isInStock(product)) return;
    const stock = Number(product.stock ?? 0);
    if (stock <= 0 && !this.hasFlavors(product)) {
      alert('This product is sold out');
      return;
    }
    this.cart.add({
      ...product,
      price: product.price ?? product.base_price ?? 0,
      flavor: product.flavor ?? '',
      variantId: product.variantId ?? null,
      maxStock: product.maxStock ?? product.stock ?? 0,
      image: product.image
    });
  }
}