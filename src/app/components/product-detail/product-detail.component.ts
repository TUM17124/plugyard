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

        <!-- Back -->
        <button
          (click)="goBack()"
          class="text-zinc-400 hover:text-emerald-400 text-sm mb-6 transition">
          ← Back to shop
        </button>

        @if (loading()) {
          <div class="text-center py-20 text-zinc-500">Loading...</div>
        } @else if (!product()) {
          <div class="text-center py-20 text-zinc-500">
            <p class="text-lg">Product not found</p>
            <a routerLink="/" class="text-emerald-400 hover:underline text-sm mt-2 inline-block">Go home</a>
          </div>
        } @else {
          <!-- Main detail -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            <!-- Image -->
            <div class="aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <img
                [src]="product().image"
                [alt]="product().name"
                class="w-full h-full object-cover">
            </div>

            <!-- Info -->
            <div class="flex flex-col">
              <p class="text-xs uppercase tracking-wider text-emerald-400 mb-2">
                {{ categoryLabel(product().category) }}
              </p>
              <h1 class="text-3xl sm:text-4xl font-black mb-3">{{ product().name }}</h1>

              @if (product().brand) {
                <p class="text-zinc-400 text-sm mb-4">Brand: <span class="text-white">{{ product().brand }}</span></p>
              }

              <p class="text-2xl font-bold text-emerald-400 mb-4">
                KSH {{ product().base_price || product().price }}
              </p>

              @if (isInStock(product())) {
                <p class="text-sm text-emerald-400 mb-6">In Stock</p>
              } @else {
                <p class="text-sm text-red-400 mb-6">Sold Out</p>
              }

              <!-- Description -->
              <div class="mb-8">
                <h2 class="font-semibold text-lg mb-2">Description</h2>
                <p class="text-zinc-300 leading-relaxed whitespace-pre-line">
                  {{ product().description || 'No description available.' }}
                </p>
              </div>

              <!-- Flavors -->
              @if (hasFlavors(product())) {
                <div class="mb-6">
                  <h2 class="font-semibold text-lg mb-3">Choose flavor</h2>
                  <div class="space-y-2">
                    @for (v of availableVariants(); track v.id) {
                      <button
                        (click)="selectedVariant.set(v)"
                        class="w-full text-left px-4 py-3 rounded-xl border transition"
                        [class.border-emerald-500]="selectedVariant()?.id === v.id"
                        [class.bg-emerald-500/10]="selectedVariant()?.id === v.id"
                        [class.border-zinc-700]="selectedVariant()?.id !== v.id">
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

              <!-- Add to cart -->
              @if (!isInStock(product())) {
                <button disabled
                  class="w-full sm:w-auto bg-zinc-700 text-zinc-400 font-bold px-8 py-3.5 rounded-full cursor-not-allowed">
                  Sold Out
                </button>
              } @else {
                <button
                  (click)="addToCart()"
                  class="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-3.5 rounded-full transition active:scale-95">
                  Add to Cart
                </button>
              }
            </div>
          </div>

          <!-- Similar products -->
          @if (similar().length > 0) {
            <div class="border-t border-zinc-800 pt-12">
              <h2 class="text-2xl font-bold mb-6">Similar products</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                @for (p of similar(); track p.id) {
                  <a
                    [routerLink]="['/product', p.id]"
                    class="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-emerald-500/50 transition block">
                    <div class="aspect-square overflow-hidden bg-zinc-800">
                      <img
                        [src]="p.image"
                        [alt]="p.name"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy">
                    </div>
                    <div class="p-4">
                      <p class="text-xs text-emerald-400 uppercase mb-1">{{ categoryLabel(p.category) }}</p>
                      <h3 class="font-semibold line-clamp-1 mb-1">{{ p.name }}</h3>
                      <p class="text-emerald-400 font-bold">KSH {{ p.base_price || p.price }}</p>
                    </div>
                  </a>
                }
              </div>
            </div>
          }
        }
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  private cart = inject(CartService);

  product = signal<any>(null);
  similar = signal<any[]>([]);
  loading = signal(true);
  selectedVariant = signal<any>(null);

  ngOnInit() {
  this.route.paramMap.subscribe(params => {
    const id = Number(params.get('id'));
    if (id) this.loadProduct(id);
  });
}

loadProduct(id: number) {
  // Jump to top immediately when opening / switching product
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

  this.loading.set(true);
  this.product.set(null);
  this.similar.set([]);
  this.selectedVariant.set(null);

  this.api.getProduct(id).subscribe({
    next: (data: any) => {
      this.product.set(data);
      this.loading.set(false);

      const variants = (data.variants || []).filter(
        (v: any) => v.is_available && v.stock > 0
      );
      if (variants.length) this.selectedVariant.set(variants[0]);

      this.loadSimilar(data.category, data.id);

      // Ensure top after content renders
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
          .slice(0, 4);
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
    return this.availableVariants().length > 0;
  }

  isInStock(product: any): boolean {
    if (this.hasFlavors(product)) return true;
    return product.is_available !== false && (product.stock > 0 || product.in_stock === true);
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

  addToCart() {
    const product = this.product();
    if (!product || !this.isInStock(product)) return;

    if (this.hasFlavors(product)) {
      const variant = this.selectedVariant();
      if (!variant) {
        alert('Please choose a flavor');
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
      this.cart.add({
        ...product,
        price: product.base_price || product.price,
        flavor: '',
        maxStock: product.stock ?? 9999
      });
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}