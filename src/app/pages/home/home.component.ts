import { Component, input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGridComponent } from '../../components/product-grid/product-grid.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductGridComponent],
  template: `
    <section class="relative overflow-hidden min-h-screen flex items-center justify-center">
      <div class="absolute inset-0 bg-cover bg-no-repeat hero-bg"></div>
      <div class="absolute inset-0 bg-black/70"></div>

      <div class="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6">
          Kenya's Trusted
          <span class="text-emerald-400">Vape & Smoke Shop</span>
        </h1>
        <p class="text-zinc-300 text-lg sm:text-xl max-w-3xl mx-auto leading-8 mb-8">
          Discover a premium collection of authentic disposable vapes, refillable
          vape kits, e-liquids, bongs, hookahs, rolling papers, grinders,
          glassware, cigars, smoking accessories, and much more.
        </p>
        <a href="#products"
           class="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-10 py-4 rounded-full text-lg transition">
          Shop Now
        </a>
      </div>
    </section>

    <div id="products">
      <app-product-grid
        [selectedCategory]="selectedCategory()"
        [searchQuery]="searchQuery()" />
    </div>
  `
})
export class HomeComponent {
  selectedCategory = input<string>('recommended');
  searchQuery = input<string>('');

  @ViewChild(ProductGridComponent) productGrid?: ProductGridComponent;

  reload() {
    this.productGrid?.reload();
  }
}