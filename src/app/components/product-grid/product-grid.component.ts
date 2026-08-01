import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PRODUCTS, Product } from '../../data/products';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl sm:text-3xl font-bold">
          {{ categoryTitle }}
        </h2>
        <p class="text-zinc-400 text-sm">{{ filteredProducts.length }} items</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        @for (product of filteredProducts; track product.id) {
          <div class="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1">
            <div class="aspect-square overflow-hidden bg-zinc-800">
              <img 
                [src]="product.image" 
                [alt]="product.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy">
            </div>

            <div class="p-5">
              <p class="text-xs uppercase tracking-wider text-emerald-400 mb-1">{{ product.category }}</p>
              <h3 class="font-semibold text-lg mb-1 line-clamp-1">{{ product.name }}</h3>
              <p class="text-zinc-400 text-sm mb-4 line-clamp-2">{{ product.description }}</p>
              
              <div class="flex items-center justify-between">
                <span class="text-xl font-bold text-white">\KSH{{ product.price.toFixed(2) }}</span>
                
                <button 
                  (click)="addToCart(product)"
                  class="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-full text-sm transition-all active:scale-95">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-span-full text-center py-20 text-zinc-500">
            <p class="text-lg">No products found in this category</p>
          </div>
        }
      </div>
    </section>
  `
})
export class ProductGridComponent {
  private cart = inject(CartService);
  
  // Receive the selected category from parent
  selectedCategory = input<string>('all');

  get filteredProducts(): Product[] {
    const cat = this.selectedCategory();
    if (cat === 'all') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === cat);
  }

  get categoryTitle(): string {
  const cat = this.selectedCategory();
  const titles: Record<string, string> = {
    all: 'Shop All Products',
    vape: 'Vapes',
    eliquid: 'E-Liquids',
    bong: 'Bongs',
    rollingpaper: 'Rolling Papers',
    cigar: 'Cigars',
    accessory: 'Accessories'
  };
  return titles[cat] || 'Shop All Products';
}

  addToCart(product: Product) {
    this.cart.add(product);
  }
}