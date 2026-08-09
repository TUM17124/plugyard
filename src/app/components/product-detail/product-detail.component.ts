import { Component, inject, OnInit, signal } from '@angular/core';
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
          <!-- Main product -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">

            <div class="aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <img
                [src]="product().image"
                [alt]="product().name"
                class="w-full h-full object-cover">
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
                  <button
                    type="button"
                    disabled
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

          <!-- Similar products: horizontal swipe + cart actions -->
          @if (similar().length > 0) {
            <div class="border-t border-zinc-800 pt-12">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold">Similar products</h2>
                <p class="text-zinc-500 text-sm hidden sm:block">Swipe →</p>
              </div>

              <div class="relative">
                <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none"></div>
                <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none"></div>

                <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                  @for (p of similar(); track p.id) {
                    <div class="snap-start shrink-0 w-64 sm:w-72 group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-emerald-500/50 transition">
                      <a [routerLink]="['/product', p.id]" class="block">
                        <div class="aspect-square overflow-hidden bg-zinc-800">
                          <img
                            [src]="p.image"
                            [alt]="p.name"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy">
                        </div>
                      </a>

                      <div class="p-4">
                        <a [routerLink]="['/product', p.id]">
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
                              Choose
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

              <p class="text-[10px] text-zinc-600 mt-2 sm:hidden text-center">
                ← Swipe to see more similar products →
              </p>
            </div>
          }
        }
      </div>
    </div>

    <!-- Flavor modal for similar products -->
    @if (showFlavorModal()) {
      <div
        class="fixed inset-0 bg-black/70 z-[80] flex items-center justify-center p-4"
        (click)="closeFlavorPicker()">
        <div
          class="bg-zinc-950 border border-zinc-700 rounded-2xl w-full max-w-sm p-5"
          (click)="$event.stopPropagation()">
          <h3 class="text-lg font-bold mb-1">{{ pickerProduct()?.name }}</h3>
          <p class="text-zinc-400 text-sm mb-4">Choose your flavor</p>

          <div class="space-y-2 mb-5 max-h-60 overflow-y-auto">
            @for (v of pickerVariants(); track v.id) {
              <button
                type="button"
                (click)="pickerVariant.set(v)"
                class="w-full text-left px-4 py-3 rounded-xl border transition"
                [class.border-emerald-500]="pickerVariant()?.id === v.id"
                [class.bg-emerald-500/10]="pickerVariant()?.id === v.id"
                [class.border-zinc-700]="pickerVariant()?.id !== v.id">
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
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  private cart = inject(CartService);

  product = signal<any>(null);
  similar = signal<any[]>([]);
  loading = signal(true);

  // Main product flavor
  mainVariant = signal<any>(null);

  // Similar product flavor modal
  showFlavorModal = signal(false);
  pickerProduct = signal<any>(null);
  pickerVariant = signal<any>(null);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) this.loadProduct(id);
    });
  }

  loadProduct(id: number) {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

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