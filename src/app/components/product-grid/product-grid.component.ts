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
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="product-list" class="max-w-7xl mx-auto px-4 sm:px-6 py-12">

      <!-- Title -->
      <div class="mb-8">
        <h2 class="text-2xl sm:text-3xl font-bold">
          @if (viewMode().startsWith('search:')) {
            Results for “{{ viewMode().slice(7) }}”
          } @else if (viewMode() === 'recommended') {
            Recommended for you
          } @else {
            {{ categoryLabel(viewMode()) }}
          }
        </h2>
        <p class="text-zinc-500 text-sm mt-1">
          {{ products().length }} of {{ totalCount() }} product{{ totalCount() === 1 ? '' : 's' }}
        </p>
      </div>

      <!-- Loading first page -->
      @if (loading() && products().length === 0) {
        <div class="text-center py-20 text-zinc-500">Loading products...</div>
      } @else if (!loading() && products().length === 0) {
        <div class="text-center py-20 text-zinc-500">
          <p class="text-lg">No products found</p>
        </div>
      } @else {
        <!-- Product grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (product of products(); track product.id) {
            <div class="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1">
              <div class="aspect-square overflow-hidden bg-zinc-800">
                <img
                  [src]="product.image"
                  [alt]="product.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy">
              </div>

              <div class="p-4">
                <p class="text-xs uppercase tracking-wider text-emerald-400 mb-1">
                  {{ categoryLabel(product.category) }}
                </p>
                <h3 class="font-semibold text-base mb-1 line-clamp-1">{{ product.name }}</h3>
                <p class="text-zinc-400 text-xs mb-3 line-clamp-2">{{ product.description }}</p>

                <div class="flex items-center justify-between gap-2">
                  <div>
                    <span class="text-lg font-bold">KSH {{ product.base_price || product.price }}</span>
                    @if (isInStock(product)) {
                      <p class="text-xs text-emerald-400 mt-0.5">In Stock</p>
                    } @else {
                      <p class="text-xs text-red-400 mt-0.5">Sold Out</p>
                    }
                  </div>

                  @if (!isInStock(product)) {
                    <button disabled
                      class="bg-zinc-700 text-zinc-400 font-semibold px-3 py-1.5 rounded-full text-xs cursor-not-allowed">
                      Sold Out
                    </button>
                  } @else if (hasFlavors(product)) {
                    <button
                      (click)="openFlavorPicker(product)"
                      class="bg-zinc-100 hover:bg-white text-black font-semibold px-3 py-1.5 rounded-full text-xs transition active:scale-95">
                      Choose
                    </button>
                  } @else {
                    <button
                      (click)="addToCart(product)"
                      class="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-3 py-1.5 rounded-full text-xs transition active:scale-95">
                      Add to Cart
                    </button>
                  }
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Intersection Observer sentinel -->
        <div #scrollSentinel class="h-10 w-full" aria-hidden="true"></div>

        @if (loadingMore()) {
          <div class="text-center py-8 text-zinc-500 text-sm">Loading more...</div>
        }

        @if (!hasMore() && products().length > 0 && !loading()) {
          <div class="text-center py-8 text-zinc-600 text-sm">You’ve reached the end</div>
        }
      }
    </section>

    <!-- FLAVOR PICKER MODAL -->
    @if (showFlavorModal()) {
      <div class="fixed inset-0 bg-black/70 z-[80] flex items-center justify-center p-4"
           (click)="closeFlavorPicker()">
        <div class="bg-zinc-950 border border-zinc-700 rounded-2xl w-full max-w-sm p-5"
             (click)="$event.stopPropagation()">

          <h3 class="text-lg font-bold mb-1">{{ selectedProduct()?.name }}</h3>
          <p class="text-zinc-400 text-sm mb-4">Choose your flavor</p>

          <div class="space-y-2 mb-5 max-h-60 overflow-y-auto">
            @for (v of availableVariants(); track v.id) {
              <button
                (click)="selectedVariant.set(v)"
                class="w-full text-left px-4 py-3 rounded-xl border transition"
                [class.border-emerald-500]="selectedVariant()?.id === v.id"
                [class.bg-emerald-500/10]="selectedVariant()?.id === v.id"
                [class.border-zinc-700]="selectedVariant()?.id !== v.id">
                <div class="flex justify-between items-center">
                  <span class="font-medium">{{ v.flavor }}</span>
                  <span class="text-emerald-400 font-semibold">KSH {{ v.price }}</span>
                </div>
                <p class="text-xs text-zinc-500 mt-1">{{ v.stock }} in stock</p>
              </button>
            }
          </div>

          <div class="flex gap-3">
            <button
              (click)="closeFlavorPicker()"
              class="flex-1 border border-zinc-700 hover:border-zinc-500 py-2.5 rounded-xl text-sm transition">
              Cancel
            </button>
            <button
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
  loading = signal(true);
  loadingMore = signal(false);
  viewMode = signal<string>('recommended');

  currentPage = signal(1);
  totalCount = signal(0);
  hasMore = signal(true);

  showFlavorModal = signal(false);
  selectedProduct = signal<any>(null);
  selectedVariant = signal<any>(null);

  private observer: IntersectionObserver | null = null;
  private skipFirstCategoryEffect = true;

  constructor() {
    // Category from header
    effect(() => {
      const cat = this.selectedCategory();
      // avoid double-load with ngOnInit on first run when empty
      if (this.skipFirstCategoryEffect) {
        this.skipFirstCategoryEffect = false;
        if (!cat || cat === 'all' || cat === '') return;
      }
      if (!cat || cat === 'all') return;

      if (cat === 'recommended') {
        this.loadRecommended();
      } else {
        this.loadCategory(cat);
      }
    });

    // Search from header
    effect(() => {
      const q = this.searchQuery()?.trim();
      if (!q) return;
      this.loadSearch(q);
    });

    afterNextRender(() => {
      this.setupIntersectionObserver();
    });
  }

  ngOnInit() {
    // Only load recommended if no search/category forced yet
    if (!this.searchQuery()?.trim()) {
      const cat = this.selectedCategory();
      if (!cat || cat === 'recommended' || cat === 'all' || cat === '') {
        this.loadRecommended();
      }
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.observer = null;
  }

  private setupIntersectionObserver() {
    this.observer?.disconnect();

    this.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (this.loading() || this.loadingMore() || !this.hasMore()) return;
        this.loadNextPage();
      },
      {
        root: null,
        rootMargin: '250px',
        threshold: 0
      }
    );

    this.observeSentinel();
  }

  private observeSentinel() {
    const el = this.scrollSentinel()?.nativeElement;
    if (!el || !this.observer) return;
    this.observer.disconnect();
    this.observer.observe(el);
  }

  loadRecommended() {
    this.resetAndLoad({ recommended: true }, 'recommended');
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

    this.api.getProducts({ ...params, page: 1 }).subscribe({
      next: (res) => {
        this.products.set(res.results || []);
        this.totalCount.set(res.count || 0);
        this.hasMore.set(!!res.next);
        this.loading.set(false);
        this.cdr.detectChanges();
        this.observeSentinel();

        if (mode !== 'recommended') {
          document.getElementById('product-list')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      },
      error: () => {
        this.loading.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  loadNextPage() {
    if (!this.hasMore() || this.loadingMore() || this.loading()) return;

    this.loadingMore.set(true);
    const nextPage = this.currentPage() + 1;
    const mode = this.viewMode();
    const params: any = { page: nextPage };

    if (mode === 'recommended') {
      params.recommended = true;
    } else if (mode.startsWith('search:')) {
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
    if (mode === 'recommended') {
      this.loadRecommended();
    } else if (mode.startsWith('search:')) {
      this.loadSearch(mode.slice(7));
    } else {
      this.loadCategory(mode);
    }
  }

  availableVariants = () => {
    const p = this.selectedProduct();
    if (!p?.variants) return [];
    return p.variants.filter((v: any) => v.is_available && v.stock > 0);
  };

  categoryLabel(category: string): string {
    const labels: Record<string, string> = {
      recommended: 'Recommended',
      vape: 'Vapes',
      eliquid: 'E-Liquids',
      bong: 'Bongs',
      rollingpaper: 'Rolling Papers',
      cigar: 'Cigars',
      accessory: 'Accessories'
    };
    return labels[category] || category;
  }

  hasFlavors(product: any): boolean {
    const variants = product.variants || [];
    return variants.some((v: any) => v.is_available && v.stock > 0);
  }

  isInStock(product: any): boolean {
    if (this.hasFlavors(product)) return true;
    return product.is_available !== false && (product.stock > 0 || product.in_stock === true);
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
      maxStock: variant.stock
    });

    this.closeFlavorPicker();
  }

  addToCart(product: any) {
    if (!this.isInStock(product)) return;

    const stock = product.stock ?? 0;
    if (stock <= 0 && !this.hasFlavors(product)) {
      alert('This product is sold out');
      return;
    }

    this.cart.add({
      ...product,
      price: product.base_price || product.price,
      flavor: '',
      maxStock: stock
    });
  }
}