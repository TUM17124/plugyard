import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { CheckoutModalComponent } from './components/checkout-modal/checkout-modal.component';
import { AgeGateComponent } from './components/age-gate/age-gate.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ProductGridComponent,
    CartDrawerComponent,
    CheckoutModalComponent,
    AgeGateComponent
  ],
  template: `
    <app-age-gate />

    <app-header 
      (openCart)="cartOpen.set(true)" 
      (selectCategory)="onCategoryChange($event)" />

    <!-- Hero -->
    <section class="relative bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 py-20 sm:py-28 overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
      <div class="relative max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl sm:text-6xl font-black tracking-tight mb-4">
          Premium <span class="text-emerald-400">Smoking</span> Gear
        </h1>
        <p class="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto mb-8">
          Vapes • E-Liquids • Bongs • Accessories.<br class="hidden sm:block">
          Fast delivery. Discreet packaging.
        </p>
        <a href="#products" 
           class="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-3.5 rounded-full transition active:scale-95">
          Shop Now
        </a>
      </div>
    </section>

    <div id="products">
      <app-product-grid [selectedCategory]="currentCategory()" />
    </div>

    <!-- Footer -->
    <footer class="border-t border-zinc-800 py-12 mt-8">
      <div class="max-w-7xl mx-auto px-4 text-center text-zinc-500 text-sm space-y-2">
        <p class="text-zinc-400 font-medium">PlugYard</p>
        <p>© 2026 All rights reserved.</p>
        <p>You must be 18+ (or 21+ depending on your location) to purchase.</p>
        <p class="text-xs">Please vape and smoke responsibly.</p>
      </div>
    </footer>

    <app-cart-drawer 
      [isOpen]="cartOpen()" 
      (close)="cartOpen.set(false)"
      (checkout)="openCheckout()" />

    <app-checkout-modal
      [isOpen]="checkoutOpen()"
      (close)="checkoutOpen.set(false)"
      (orderPlaced)="onOrderPlaced()" />
  `
})
export class App {
  cartOpen = signal(false);
  checkoutOpen = signal(false);
  currentCategory = signal('all');

  onCategoryChange(category: string) {
    this.currentCategory.set(category);
    // Smooth scroll to products
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }

  openCheckout() {
    this.cartOpen.set(false);
    this.checkoutOpen.set(true);
  }

  onOrderPlaced() {
    this.checkoutOpen.set(false);
  }
}