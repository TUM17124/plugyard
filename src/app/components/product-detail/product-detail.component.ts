import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
  ElementRef,
  viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-zinc-950 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        <button
          type="button"
          (click)="goBack()"
          class="text-zinc-400 hover:text-emerald-400 text-sm mb-6 transition">
          ← Back to shop
        </button>

        @if (loading()) {
          <div class="text-center py-20 text-zinc-500">Loading...</div>
        } @else if (!product()) {
          <div class="text-center py-20 text-zinc-500">
            <p class="text-lg">Product not found</p>
            <a routerLink="/" class="text-emerald-400 hover:underline text-sm mt-2 inline-block">
              Go home
            </a>
          </div>
        } @else {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">

<div class="aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
  <img
    [src]="displayImage()"
    [alt]="product().name"
    class="w-full h-full object-contain transition-opacity duration-300">
</div>
            <div class="flex flex-col">
              <p class="text-xs uppercase tracking-wider text-emerald-400 mb-2">
                {{ categoryLabel(product().category) }}
              </p>
              <h1 class="text-3xl sm:text-4xl font-black mb-3">{{ product().name }}</h1>

              @if (product().brand) {
                <p class="text-zinc-400 text-sm mb-4">
                  Brand: <span class="text-white">{{ product().brand }}</span>
                </p>
              }

              <div class="mb-4">
                <p class="text-2xl font-bold text-emerald-400">
                  KSH {{ displayPrice() }}
                </p>
                @if (isInStock(product())) {
                  <p class="text-sm text-emerald-400 mt-1">In Stock</p>
                } @else {
                  <p class="text-sm text-red-400 mt-1">Sold Out</p>
                }
              </div>

              <div class="mb-8">
                <h2 class="font-semibold text-lg mb-2">Description</h2>
                <p class="text-zinc-300 leading-relaxed whitespace-pre-line">
                  {{ product().description || 'No description available.' }}
                </p>
              </div>

              @if (hasFlavors(product())) {
                <div class="mb-6">
                  <h2 class="font-semibold text-lg mb-3">Choose flavor</h2>
                  <div class="space-y-2">
                    @for (v of availableVariants(); track v.id) {
                      <button
                        type="button"
                        (click)="mainVariant.set(v)"
                        class="w-full text-left px-4 py-3 rounded-xl border transition"
                        [class.border-emerald-500]="mainVariant()?.id === v.id"
                        [class.bg-emerald-500/10]="mainVariant()?.id === v.id"
                        [class.border-zinc-700]="mainVariant()?.id !== v.id">
                        <div class="flex justify-between">
                          <span>{{ v.flavor }}</span>
                          <span class="text-emerald-400">KSH {{ v.price }}</span>
                        </div>
                        <p class="text-xs text-zinc-500 mt-1">{{ v.stock }} in stock</p>
                      </button>
                    }
                  </div>
                </div>
              }

              <div class="mt-auto pt-2">
                @if (!isInStock(product())) {
                  <button type="button" disabled
                    class="w-full sm:w-auto bg-zinc-700 text-zinc-400 font-bold px-8 py-3.5 rounded-full cursor-not-allowed">
                    Sold Out
                  </button>
                } @else if (hasFlavors(product())) {
                  <button
                    type="button"
                    (click)="addMainToCart()"
                    [disabled]="!mainVariant()"
                    class="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold px-8 py-3.5 rounded-full transition active:scale-95">
                    Add to Cart
                    @if (mainVariant()) {
                      <span class="font-medium"> — {{ mainVariant().flavor }}</span>
                    }
                  </button>
                } @else {
                  <button
                    type="button"
                    (click)="addMainToCart()"
                    class="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-3.5 rounded-full transition active:scale-95">
                    Add to Cart
                  </button>
                }
              </div>
            </div>
          </div>

          @if (similar().length > 0) {
            <div class="border-t border-zinc-800 pt-12">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold">Similar products</h2>

                <div class="hidden sm:flex items-center gap-2">
                  <button
                    type="button"
                    (click)="scrollSimilar(-1)"
                    class="w-9 h-9 rounded-full border border-zinc-700 hover:border-emerald-500 hover:text-emerald-400 flex items-center justify-center text-xl transition">
                    ‹
                  </button>
                  <button
                    type="button"
                    (click)="scrollSimilar(1)"
                    class="w-9 h-9 rounded-full border border-zinc-700 hover:border-emerald-500 hover:text-emerald-400 flex items-center justify-center text-xl transition">
                    ›
                  </button>
                </div>
              </div>

              <div class="relative">
                <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none"></div>
                <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none"></div>

                <!-- similar row: wheel + drag -->
                <div
                  #similarRow
                  class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory similar-scroll"
                  [class.is-dragging]="dragging">
                  @for (p of similar(); track p.id) {
                    <div class="snap-start shrink-0 w-64 sm:w-72 group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-emerald-500/50 transition">
                      <a [routerLink]="['/product', p.id]" class="block" (click)="onCardClick($event)">
                        <div class="aspect-square overflow-hidden bg-zinc-800">
                          <img
                            [src]="p.image"
                            [alt]="p.name"
                            class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            draggable="false">
                        </div>
                      </a>

                      <div class="p-4">
                        <a [routerLink]="['/product', p.id]" (click)="onCardClick($event)">
                          <p class="text-xs text-emerald-400 uppercase mb-1">{{ categoryLabel(p.category) }}</p>
                          <h3 class="font-semibold line-clamp-1 mb-1">{{ p.name }}</h3>
                        </a>
                        <p class="text-zinc-400 text-xs mb-3 line-clamp-2">{{ p.description }}</p>

                        <div class="flex items-center justify-between gap-2">
                          <div>
                            <p class="text-emerald-400 font-bold text-sm">KSH {{ p.base_price || p.price }}</p>
                            @if (isInStock(p)) {
                              <p class="text-xs text-emerald-400 mt-0.5">In Stock</p>
                            } @else {
                              <p class="text-xs text-red-400 mt-0.5">Sold Out</p>
                            }
                          </div>

                          @if (!isInStock(p)) {
                            <button type="button" disabled
                              class="bg-zinc-700 text-zinc-400 font-semibold px-3 py-1.5 rounded-full text-xs cursor-not-allowed">
                              Sold Out
                            </button>
                          } @else if (hasFlavors(p)) {
                            <button
                              type="button"
                              (click)="openFlavorPicker(p)"
                              class="bg-zinc-100 hover:bg-white text-black font-semibold px-3 py-1.5 rounded-full text-xs transition active:scale-95">
                              Choose option
                            </button>
                          } @else {
                            <button
                              type="button"
                              (click)="addSimilarToCart(p)"
                              class="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-3 py-1.5 rounded-full text-xs transition active:scale-95">
                              Add to Cart
                            </button>
                          }
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <p class="text-[10px] text-zinc-500 mt-2 text-center sm:text-left">
                <span class="sm:hidden">← Swipe to see more →</span>
                <span class="hidden sm:inline">Scroll wheel, drag, scrollbar, or arrows →</span>
              </p>
            </div>
          }
        }
      </div>
    </div>

    @if (showFlavorModal()) {
      <div
        class="fixed inset-0 bg-black/70 z-[80] flex items-center justify-center p-4"
        (click)="closeFlavorPicker()">
        <div
          class="bg-zinc-950 border border-zinc-700 rounded-2xl w-full max-w-sm p-5"
          (click)="$event.stopPropagation()">
          <h3 class="text-lg font-bold mb-1">{{ pickerProduct()?.name }}</h3>
          <p class="text-zinc-400 text-sm mb-4">Choose your option</p>

          <div class="space-y-2 mb-5 max-h-60 overflow-y-auto">
            @for (v of pickerVariants(); track v.id) {
              <button
  type="button"
  (click)="mainVariant.set(v)"
  class="w-full text-left px-4 py-3 rounded-xl border transition flex gap-3 items-center"
  [class.border-emerald-500]="mainVariant()?.id === v.id"
  [class.bg-emerald-500/10]="mainVariant()?.id === v.id"
  [class.border-zinc-700]="mainVariant()?.id !== v.id">
  @if (v.image) {
    <img [src]="v.image" [alt]="v.flavor"
         class="w-12 h-12 rounded-lg object-contain bg-zinc-800 shrink-0">
  }
  <div class="flex-1 min-w-0">
    <div class="flex justify-between gap-2">
      <span class="font-medium">{{ v.flavor }}</span>
      <span class="text-emerald-400 shrink-0">KSH {{ v.price }}</span>
    </div>
    <p class="text-xs text-zinc-500 mt-1">{{ v.stock }} in stock</p>
  </div>
</button>
            }
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              (click)="closeFlavorPicker()"
              class="flex-1 border border-zinc-700 hover:border-zinc-500 py-2.5 rounded-xl text-sm transition">
              Cancel
            </button>
            <button
              type="button"
              (click)="confirmFlavorAdd()"
              [disabled]="!pickerVariant()"
              class="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold py-2.5 rounded-xl text-sm transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .similar-scroll {
      cursor: grab;
      scrollbar-width: thin;
      scrollbar-color: #52525b transparent;
    }

    .similar-scroll.is-dragging {
      cursor: grabbing;
      scroll-behavior: auto;
    }

    .similar-scroll::-webkit-scrollbar {
      height: 10px;
    }

    .similar-scroll::-webkit-scrollbar-thumb {
      background: #52525b;
      border-radius: 999px;
    }

    .similar-scroll::-webkit-scrollbar-track {
      background: #18181b;
      border-radius: 999px;
    }
  `]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  private cart = inject(CartService);

  similarRow = viewChild<ElementRef<HTMLDivElement>>('similarRow');

  product = signal<any>(null);
  similar = signal<any[]>([]);
  loading = signal(true);

  mainVariant = signal<any>(null);

  showFlavorModal = signal(false);
  pickerProduct = signal<any>(null);
  pickerVariant = signal<any>(null);

  // Drag state (plain fields — always cleared)
  dragging = false;
  private moved = false;
  private startX = 0;
  private startScroll = 0;

  private onMove = (e: MouseEvent) => this.handleMove(e);
  private onUp = () => this.endDrag();
  private onWheelBound = (e: WheelEvent) => this.handleWheel(e);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) this.loadProduct(id);
    });
  }

  ngOnDestroy() {
    this.teardownDragListeners();
    this.teardownWheel();
  }

  /** Attach wheel + drag after similar row exists */
  private setupRowInteractions() {
    setTimeout(() => {
      const el = this.similarRow()?.nativeElement;
      if (!el) return;

      // Wheel: always works (re-bind cleanly)
      el.removeEventListener('wheel', this.onWheelBound as EventListener);
      el.addEventListener('wheel', this.onWheelBound as EventListener, { passive: false });

      el.onmousedown = (e: MouseEvent) => this.startDrag(e);
    }, 0);
  }

  private teardownWheel() {
    const el = this.similarRow()?.nativeElement;
    if (!el) return;
    el.removeEventListener('wheel', this.onWheelBound as EventListener);
    el.onmousedown = null;
  }

  private handleWheel(e: WheelEvent) {
    const el = this.similarRow()?.nativeElement;
    if (!el) return;

    // Always allow horizontal scroll via wheel
    if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    } else {
      el.scrollLeft += e.deltaX;
    }
  }

  private startDrag(e: MouseEvent) {
    // Only left mouse button
    if (e.button !== 0) return;

    const el = this.similarRow()?.nativeElement;
    if (!el) return;

    this.dragging = true;
    this.moved = false;
    this.startX = e.pageX;
    this.startScroll = el.scrollLeft;

    // Document-level so mouseup outside still ends drag
    document.addEventListener('mousemove', this.onMove);
    document.addEventListener('mouseup', this.onUp);
    document.addEventListener('mouseleave', this.onUp);

    e.preventDefault();
  }

  private handleMove(e: MouseEvent) {
    if (!this.dragging) return;

    const el = this.similarRow()?.nativeElement;
    if (!el) return;

    const dx = e.pageX - this.startX;
    if (Math.abs(dx) > 4) this.moved = true;

    el.scrollLeft = this.startScroll - dx;
  }

  private endDrag() {
    this.dragging = false;
    this.teardownDragListeners();

    // Small delay so click after drag doesn't navigate
    setTimeout(() => {
      this.moved = false;
    }, 50);
  }

  private teardownDragListeners() {
    document.removeEventListener('mousemove', this.onMove);
    document.removeEventListener('mouseup', this.onUp);
    document.removeEventListener('mouseleave', this.onUp);
  }

  /** Block link navigation if user was dragging */
  onCardClick(e: Event) {
    if (this.moved || this.dragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  scrollSimilar(direction: number) {
    const el = this.similarRow()?.nativeElement;
    if (!el) return;
    this.endDrag(); // ensure clean state
    el.scrollBy({ left: direction * 320, behavior: 'smooth' });
  }

  loadProduct(id: number) {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    this.endDrag();
    this.teardownWheel();

    this.loading.set(true);
    this.product.set(null);
    this.similar.set([]);
    this.mainVariant.set(null);
    this.closeFlavorPicker();

    this.api.getProduct(id).subscribe({
      next: (data: any) => {
        this.product.set(data);
        this.loading.set(false);

        const variants = (data.variants || []).filter(
          (v: any) => v.is_available && v.stock > 0
        );
        if (variants.length) this.mainVariant.set(variants[0]);

        this.loadSimilar(data.category, data.id);

        setTimeout(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }, 0);
      },
      error: () => {
        this.loading.set(false);
        this.product.set(null);
      }
    });
  }

  loadSimilar(category: string, excludeId: number) {
    this.api.getProducts({ category, page: 1 }).subscribe({
      next: (res) => {
        const items = (res.results || [])
          .filter((p: any) => p.id !== excludeId)
          .slice(0, 8);
        this.similar.set(items);
        this.setupRowInteractions(); // re-bind wheel + drag after DOM updates
      },
      error: () => this.similar.set([])
    });
  }

  availableVariants() {
    const p = this.product();
    if (!p?.variants) return [];
    return p.variants.filter((v: any) => v.is_available && v.stock > 0);
  }

  hasFlavors(product: any): boolean {
    const variants = product?.variants || [];
    return variants.some((v: any) => v.is_available && v.stock > 0);
  }

  isInStock(product: any): boolean {
    if (this.hasFlavors(product)) return true;
    return product?.is_available !== false && (product?.stock > 0 || product?.in_stock === true);
  }

  displayPrice(): number | string {
    const p = this.product();
    const v = this.mainVariant();
    if (v?.price != null) return v.price;
    return p?.base_price || p?.price || 0;
  }

  displayImage(): string {
  const variant = this.mainVariant();
  const product = this.product();
  // Prefer flavor image when selected
  if (variant?.image) return variant.image;
  return product?.image || '';
}

  categoryLabel(category: string): string {
    const labels: Record<string, string> = {
      vape: 'Vapes',
      eliquid: 'E-Liquids',
      bong: 'Bongs',
      rollingpaper: 'Rolling Papers',
      cigar: 'Cigars',
      accessory: 'Accessories'
    };
    return labels[category] || category;
  }

  addMainToCart() {
    const product = this.product();
    if (!product || !this.isInStock(product)) return;

    if (this.hasFlavors(product)) {
      const variant = this.mainVariant();
      if (!variant) {
        alert('Please choose a flavor');
        return;
      }
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
    } else {
      const stock = product.stock ?? 0;
      if (stock <= 0) {
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

  addSimilarToCart(product: any) {
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

  pickerVariants() {
    const p = this.pickerProduct();
    if (!p?.variants) return [];
    return p.variants.filter((v: any) => v.is_available && v.stock > 0);
  }

  openFlavorPicker(product: any) {
    this.pickerProduct.set(product);
    const available = (product.variants || []).filter(
      (v: any) => v.is_available && v.stock > 0
    );
    this.pickerVariant.set(available[0] || null);
    this.showFlavorModal.set(true);
  }

  closeFlavorPicker() {
    this.showFlavorModal.set(false);
    this.pickerProduct.set(null);
    this.pickerVariant.set(null);
  }

  confirmFlavorAdd() {
    const product = this.pickerProduct();
    const variant = this.pickerVariant();
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

  goBack() {
    this.router.navigate(['/']);
  }
}