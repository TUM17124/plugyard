import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductGridComponent } from '../../components/product-grid/product-grid.component';
import { ShopFilterService } from '../../services/shop-filter.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductGridComponent],
  template: `
    <!-- Hero: only on Home (recommended, no search) -->
    @if (showHero()) {
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

          <p class="text-zinc-400 text-base sm:text-lg max-w-3xl mx-auto leading-8 mb-10">
            Shop with confidence, enjoy discreet packaging, secure ordering, and
            fast delivery across Nairobi and other major towns in Kenya.
          </p>

         <!-- <div class="max-w-2xl mx-auto mb-10 text-zinc-300 text-sm">
            <p class="text-emerald-400 font-bold text-lg mb-3">🚚 Fast Delivery via Fargo Courier</p>
            <p class="mb-2">✓ Nairobi: usually within <span class="text-white font-semibold">24 hours</span></p>
            <p class="mb-2">✓ Other major towns: next-day when confirmed in time</p>
            <p class="text-zinc-400 text-xs mt-2">Delivery fee from about KES 300 in Nairobi</p>
          </div>  -->

          <a
            href="#products"
            class="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-10 py-4 rounded-full text-lg transition active:scale-95">
            Shop Now
          </a>
        </div>
      </section>
    }

    <div id="products">
      <app-product-grid
        [selectedCategory]="filters.category()"
        [searchQuery]="filters.search()" />
    </div>
  `
})
export class HomeComponent {
  filters = inject(ShopFilterService);

  showHero = computed(() => {
    const cat = this.filters.category();
    const search = this.filters.search()?.trim();
    // Only on true Home
    return !search && (cat === 'recommended' || cat === '' || cat === 'all');
  });
}