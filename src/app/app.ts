import { Component, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { CheckoutModalComponent } from './components/checkout-modal/checkout-modal.component';
import { AgeGateComponent } from './components/age-gate/age-gate.component';
import { LegalComponent } from './components/legal/legal.component';
import { OrdersDrawerComponent } from './components/orders-drawer/orders-drawer.component';
import { HomeComponent } from './pages/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
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

    <!-- THIS is required for product pages -->
    <router-outlet />

    <footer class="border-t border-zinc-800 py-12 mt-8">
      <div class="max-w-7xl mx-auto px-4 text-center text-zinc-500 text-sm space-y-4">
        <p class="text-zinc-400 font-medium text-base">PlugYard</p>
        <p>
          Contact:
          <a href="mailto:contact@plugyard.com" class="text-emerald-400 hover:underline">contact@plugyard.com</a>
          <br>
          Call:
          <a href="tel:+254753492246" class="text-emerald-400 hover:underline">+254 753 492 246</a>
        </p>
        <div class="flex flex-wrap justify-center gap-4 text-xs">
          <button (click)="openLegal('terms')" class="hover:text-emerald-400 transition">Terms of Service</button>
          <button (click)="openLegal('privacy')" class="hover:text-emerald-400 transition">Privacy Policy</button>
          <button (click)="openLegal('disclaimer')" class="hover:text-emerald-400 transition">Age & Legal Disclaimer</button>
        </div>
        <p>© 2026 All rights reserved.</p>
        <p>You must be 18+ (or the legal age in your location) to purchase.</p>
      </div>
    </footer>

    <a
      href="https://wa.me/254753492246?text=Hi%20PlugYard%2C%20I%20have%20a%20question"
      target="_blank"
      rel="noopener noreferrer"
      class="whatsapp-float fixed bottom-6 right-6 z-[100] flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] shadow-lg"
      aria-label="Chat on WhatsApp">
      <!-- your svg -->
    </a>

    <app-cart-drawer
      [isOpen]="cartOpen()"
      (close)="cartOpen.set(false)"
      (checkout)="openCheckout()" />

    <app-orders-drawer
      [isOpen]="ordersOpen()"
      (close)="ordersOpen.set(false)" />

    <app-checkout-modal
      [isOpen]="checkoutOpen()"
      (close)="checkoutOpen.set(false)"
      (orderPlaced)="onOrderPlaced()" />

    <app-legal
      [isOpen]="legalOpen()"
      [type]="legalType()"
      (close)="legalOpen.set(false)" />
  `
})
export class App {
  cartOpen = signal(false);
  ordersOpen = signal(false);
  checkoutOpen = signal(false);
  currentCategory = signal('recommended');
  searchQuery = signal('');

  legalOpen = signal(false);
  legalType = signal<'terms' | 'privacy' | 'disclaimer'>('terms');

  onCategoryChange(category: string) {
    this.searchQuery.set('');
    this.currentCategory.set(category);
    // Navigate home so grid is visible
    // inject Router if needed: this.router.navigate(['/'])
  }

  onSearch(q: string) {
    this.currentCategory.set('');
    this.searchQuery.set(q);
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
    // reload products if you keep ViewChild on home later
  }
}