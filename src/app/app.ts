import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { CheckoutModalComponent } from './components/checkout-modal/checkout-modal.component';
import { AgeGateComponent } from './components/age-gate/age-gate.component';
import { LegalComponent } from './components/legal/legal.component';
import { OrdersDrawerComponent } from './components/orders-drawer/orders-drawer.component';
import { ShopFilterService } from './services/shop-filter.service';

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

    <router-outlet />

    <footer class="border-t border-zinc-800 py-12 mt-8">
      <div class="max-w-7xl mx-auto px-4 text-center text-zinc-500 text-sm space-y-4">
        <p class="text-zinc-400 font-medium text-base">PlugYard</p>
        <p>
          Contact:
          <a href="mailto:contact@plugyard.com" class="text-emerald-400 hover:underline">
            contact@plugyard.com
          </a>
          <br />
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

    <a
      href="https://wa.me/254753492246?text=Hi%20PlugYard%2C%20I%20have%20a%20question"
      target="_blank"
      rel="noopener noreferrer"
      class="whatsapp-float fixed bottom-6 right-6 z-[100] flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] shadow-lg"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="#ffffff" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
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
  private router = inject(Router);
  private filters = inject(ShopFilterService);

  cartOpen = signal(false);
  ordersOpen = signal(false);
  checkoutOpen = signal(false);

  legalOpen = signal(false);
  legalType = signal<'terms' | 'privacy' | 'disclaimer'>('terms');

  onCategoryChange(category: string) {
    this.filters.setCategory(category);
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    });
  }

  onSearch(q: string) {
    this.filters.setSearch(q);
     window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    });
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
    const match = this.router.url.match(/\/product\/(\d+)/);
    if (match) {
      const id = match[1];
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/product', id]);
      });
    } else {
      // Home: refresh category filter so product grid reloads
      const cat = this.filters.category() || 'recommended';
      this.filters.setCategory('');
      setTimeout(() => this.filters.setCategory(cat), 0);
    }
  }, 1000);
}
}