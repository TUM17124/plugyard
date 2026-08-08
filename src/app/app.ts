import { Component, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { CheckoutModalComponent } from './components/checkout-modal/checkout-modal.component';
import { AgeGateComponent } from './components/age-gate/age-gate.component';
import { LegalComponent } from './components/legal/legal.component';
import { OrdersDrawerComponent } from './components/orders-drawer/orders-drawer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ProductGridComponent,
    CartDrawerComponent,
    CheckoutModalComponent,
    AgeGateComponent,
    LegalComponent,
    OrdersDrawerComponent
  ],
  template: `
    <app-age-gate />

    <app-header 
      (openCart)="cartOpen.set(true)" 
      (openOrders)="ordersOpen.set(true)"
      (selectCategory)="onCategoryChange($event)"
      (search)="onSearch($event)" />

<section class="relative overflow-hidden min-h-screen flex items-center justify-center">

  <!-- Responsive Background -->
  <div
    class="absolute inset-0 bg-cover bg-no-repeat hero-bg">
  </div>

  <!-- Dark Overlay -->
  <div class="absolute inset-0 bg-black/70"></div>

  <!-- Hero Content -->
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
      Whether you're a beginner or an experienced enthusiast, PlugYard offers
      carefully selected products from trusted brands at competitive prices.
      Shop with confidence, enjoy discreet packaging, secure ordering, and
      fast delivery across Nairobi and other major towns in Kenya.
    </p>

    <!-- Fargo Delivery -->
    <div class="max-w-2xl mx-auto mb-10 bg-transparent rounded-2xl px-6 py-5 text-zinc-300">

      <p class="text-emerald-400 font-bold text-lg mb-3">
        🚚 Fast Delivery via Fargo Courier
      </p>

      <p class="mb-2">
        ✓ Nairobi deliveries are usually completed within
        <span class="text-white font-semibold">24 hours.</span>
      </p>

      <p class="mb-2">
        ✓ Other major towns receive next-day delivery once your order is
        confirmed.
      </p>

      <p class="mb-2">
        ✓ Secure and discreet packaging for every order.
      </p>

      <p class="text-sm text-zinc-400 mt-3">
        Delivery charges are confirmed after placing your order (starting from
        approximately <span class="text-white">KES 300</span> within Nairobi).
      </p>

    </div>

    <a
      href="#products"
      class="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-10 py-4 rounded-full text-lg transition duration-300 active:scale-95 shadow-xl shadow-emerald-500/20">
      Shop Now
    </a>

  </div>

</section>
    <div id="products">
      <app-product-grid [selectedCategory]="currentCategory()" 
      [searchQuery]="searchQuery()"/>
    </div>

    <!-- Footer -->
    <footer class="border-t border-zinc-800 py-12 mt-8">
      <div class="max-w-7xl mx-auto px-4 text-center text-zinc-500 text-sm space-y-4">
        <p class="text-zinc-400 font-medium text-base">PlugYard</p>

        <p>
          Contact:
          <a href="mailto:contact@plugyard.com" class="text-emerald-400 hover:underline">
            contact@plugyard.com
          </a> <br>
          Call:
          <a href="tel:+254753492246" class="text-emerald-400 hover:underline">
            +254 753 492 246
          </a>
        </p>

        <div class="flex flex-wrap justify-center gap-4 text-xs">
          <button (click)="openLegal('terms')" class="hover:text-emerald-400 transition">
            Terms of Service
          </button>
          <button (click)="openLegal('privacy')" class="hover:text-emerald-400 transition">
            Privacy Policy
          </button>
          <button (click)="openLegal('disclaimer')" class="hover:text-emerald-400 transition">
            Age & Legal Disclaimer
          </button>
        </div>

        <p>© 2026 All rights reserved.</p>
        <p>You must be 18+ (or the legal age in your location) to purchase.</p>
        <p class="text-xs">Please vape and smoke responsibly.</p>
      </div>
    </footer>

    <!-- Floating WhatsApp Button -->
<a
  href="https://wa.me/254753492246?text=Hi%20PlugYard%2C%20I%20have%20a%20question"
  target="_blank"
  rel="noopener noreferrer"
  class="whatsapp-float fixed bottom-6 right-6 z-[100] flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] shadow-lg shadow-black/50"
  aria-label="Chat on WhatsApp"
  title="Chat on WhatsApp">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-8 h-8 fill-white">
    <path d="M16.004 2.667c-7.36 0-13.333 5.973-13.333 13.333 0 2.347.64 4.64 1.867 6.667L2.67 29.333l6.827-1.787A13.25 13.25 0 0 0 16.004 29.333c7.36 0 13.333-5.973 13.333-13.333S23.364 2.667 16.004 2.667zm0 24a10.6 10.6 0 0 1-5.387-1.467l-.387-.227-4.053 1.067 1.08-3.947-.253-.4A10.56 10.56 0 0 1 5.337 16c0-5.88 4.787-10.667 10.667-10.667S26.67 10.12 26.67 16s-4.787 10.667-10.666 10.667zm5.84-7.973c-.32-.16-1.893-.933-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.827 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.347-.496-2.56-1.573-.947-.84-1.587-1.88-1.773-2.2-.187-.32-.02-.493.14-.653.147-.147.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.26-.64-.52-.533-.72-.533h-.613c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667s1.147 3.093 1.307 3.307c.16.213 2.253 3.44 5.453 4.827 2.027.88 2.827.96 3.84.813.587-.08 1.893-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z"/>
  </svg>
</a>

    <!-- Cart Drawer -->
    <app-cart-drawer 
      [isOpen]="cartOpen()" 
      (close)="cartOpen.set(false)"
      (checkout)="openCheckout()" />

    <!-- Orders Drawer -->
    <app-orders-drawer
      [isOpen]="ordersOpen()"
      (close)="ordersOpen.set(false)" />

    <!-- Checkout Modal -->
    <app-checkout-modal
      [isOpen]="checkoutOpen()"
      (close)="checkoutOpen.set(false)"
      (orderPlaced)="onOrderPlaced()" />

    <!-- Legal Modal -->
    <app-legal
      [isOpen]="legalOpen()"
      [type]="legalType()"
      (close)="legalOpen.set(false)" />
  `
})
export class App {
  // inside the class:
@ViewChild(ProductGridComponent) productGrid?: ProductGridComponent;


  cartOpen = signal(false);
  ordersOpen = signal(false);
  checkoutOpen = signal(false);
  currentCategory = signal('recommended');
  searchQuery = signal('');

  legalOpen = signal(false);
  legalType = signal<'terms' | 'privacy' | 'disclaimer'>('terms');

  onCategoryChange(category: string) {
    this.currentCategory.set(category);
    this.searchQuery.set('');
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }

  onSearch(q: string) {
  this.currentCategory.set('');
  this.searchQuery.set(q);
  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
}

  openLegal(type: 'terms' | 'privacy' | 'disclaimer') {
    this.legalType.set(type);
    this.legalOpen.set(true);
  }

  openCheckout() {
    this.cartOpen.set(false);
    this.checkoutOpen.set(true);
  }

  onOrderPlaced() {
     setTimeout(() => {
    this.productGrid?.reload();
  }, 100);
    // Keep checkout open so the confirmation screen can show
    // or close it if you prefer:
    // this.checkoutOpen.set(false);
  }
}