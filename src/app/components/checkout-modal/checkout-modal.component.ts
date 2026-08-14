import { Component, inject, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';

const SAVED_CHECKOUT_KEY = 'plugyard-checkout-info';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm" (click)="!orderSuccess() && close.emit()"></div>

      <div class="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div class="bg-zinc-950 border border-zinc-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

          @if (!orderSuccess()) {
            <div class="flex items-center justify-between p-5 border-b border-zinc-800">
              <h2 class="text-xl font-bold">Checkout</h2>
              <button type="button" (click)="close.emit()" class="text-zinc-400 hover:text-white text-2xl">&times;</button>
            </div>

            <div class="p-5 border-b border-zinc-800">
              <h3 class="font-semibold mb-3 text-zinc-300">Order Summary</h3>
              @for (item of cart.items(); track item.product.id + (item.flavor || '')) {
  <div class="flex justify-between items-center text-sm mb-2 gap-2">
    <div class="flex items-center gap-2 min-w-0">
      <img
        [src]="item.image || item.product.image"
        class="w-10 h-10 object-contain rounded-lg bg-zinc-800 shrink-0"
        alt="">
      <span class="truncate">
        {{ item.qty }}× {{ item.product.name }}
        @if (item.flavor) {
          <span class="text-zinc-400">({{ item.flavor }})</span>
        }
      </span>
    </div>
    <span class="shrink-0">KSH {{ item.price * item.qty }}</span>
  </div>
}

              <div class="flex justify-between font-bold text-lg mt-4 pt-3 border-t border-zinc-800">
                <span>Total</span>
                <span class="text-emerald-400">KSH {{ cart.totalPrice() }}</span>
              </div>
            </div>

            <form (ngSubmit)="submitOrder()" class="p-5 space-y-4">
              <div>
                <label class="block text-sm text-zinc-400 mb-1">Full Name *</label>
                <input [(ngModel)]="form.name" name="name" required
                  class="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                  placeholder="John Doe">
              </div>

              <div>
                <label class="block text-sm text-zinc-400 mb-1">Email *</label>
                <input [(ngModel)]="form.email" name="email" type="email" required
                  class="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                  placeholder="you@example.com">
              </div>

              <div>
                <label class="block text-sm text-zinc-400 mb-1">Phone *</label>
                <input [(ngModel)]="form.phone" name="phone" required
                  class="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                  placeholder="+254 7XX XXX XXX">
              </div>

              <div>
                <label class="block text-sm text-zinc-400 mb-1">Delivery Address *</label>
                <textarea [(ngModel)]="form.address" name="address" required rows="3"
                  class="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                  placeholder="Street, City, Area"></textarea>
              </div>

              <div>
                <label class="block text-sm text-zinc-400 mb-1">Notes (optional)</label>
                <input [(ngModel)]="form.notes" name="notes"
                  class="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                  placeholder="Any special request?">
              </div>

              <!-- Save for next time -->
              <label class="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  [(ngModel)]="saveInfo"
                  name="saveInfo"
                  class="mt-1 w-4 h-4 rounded border-zinc-600 bg-zinc-900 text-emerald-500 focus:ring-emerald-500">
                <span class="text-sm text-zinc-300">
                  Save this information for next time
                  <span class="block text-xs text-zinc-500 mt-0.5">
                    We’ll fill your name, email, phone and address automatically on your next order.
                  </span>
                </span>
              </label>

              <button type="submit" [disabled]="loading()"
                class="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-3.5 rounded-xl transition">
                {{ loading() ? 'Sending Order...' : 'Place Order' }}
              </button>

              <p class="text-xs text-zinc-500 text-center">
                We will contact you shortly to confirm payment & delivery.
              </p>

              <!-- Shipping & Refund -->
              <div class="mt-2 space-y-3 text-xs text-zinc-500 border-t border-zinc-800 pt-4">
                <div>
                  <p class="text-zinc-300 font-semibold text-sm mb-1">Shipping</p>
                  <p>
                    Delivery is via Fargo Courier (or another method we confirm with you).
                    Nairobi & environs: usually within 24 hours after confirmation.
                    Other major towns: next-day when the order is confirmed in time.
                    Delivery fee is confirmed when we contact you (from about KES 300 in Nairobi).
                  </p>
                </div>
                <div>
                  <p class="text-zinc-300 font-semibold text-sm mb-1">Refund policy</p>
                  <p>
                    Because of the nature of our products, we generally do not offer refunds on opened
                    or used items. If you receive a damaged, defective, or wrong product, contact us
                    within 24 hours of delivery with photos and your order details. We will arrange a
                    replacement or refund where appropriate after verification.
                  </p>
                </div>
              </div>
            </form>

          } @else {
            <div class="p-6 text-center">
              <div class="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 class="text-2xl font-bold mb-2">Order Received!</h2>
              <p class="text-zinc-400 mb-6">Thank you {{ form.name }}. We will contact you soon.</p>

              <div class="bg-zinc-900 rounded-xl p-4 text-left mb-6">
                <h3 class="font-semibold text-zinc-300 mb-3">Items Ordered</h3>

                @for (item of orderedItems; track item.product.id + (item.flavor || '')) {
                  <div class="flex gap-3 mb-3 last:mb-0 items-center">
                    <img
  [src]="item.image || item.product.image"
  class="w-14 h-14 object-contain rounded-lg bg-zinc-800"
  alt="">
                    <div class="flex-1">
                      <p class="font-medium text-sm">{{ item.product.name }}</p>
                      @if (item.flavor) {
                        <p class="text-emerald-400 text-xs">{{ item.flavor }}</p>
                      }
                      <p class="text-zinc-400 text-xs">Qty: {{ item.qty }}</p>
                    </div>
                    <p class="text-emerald-400 font-medium text-sm">
                      KSH {{ item.price * item.qty }}
                    </p>
                  </div>
                }

                <div class="flex justify-between font-bold mt-4 pt-3 border-t border-zinc-700">
                  <span>Total</span>
                  <span class="text-emerald-400">KSH {{ orderTotal }}</span>
                </div>
              </div>

              <button
                type="button"
                (click)="finish()"
                class="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3.5 rounded-xl transition">
                Continue Shopping
              </button>
            </div>
          }
        </div>
      </div>
    }
  `
})
export class CheckoutModalComponent {
  cart = inject(CartService);
  api = inject(ApiService);

  isOpen = input(false);
  close = output<void>();
  orderPlaced = output<void>();

  loading = signal(false);
  orderSuccess = signal(false);

  orderedItems: CartItem[] = [];
  orderTotal = 0;

  saveInfo = true; // default checked

  form = {
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  };

  constructor() {
    // Load saved info when modal opens
    effect(() => {
      if (this.isOpen()) {
        this.loadSavedInfo();
      }
    });
  }

  private loadSavedInfo() {
    try {
      const raw = localStorage.getItem(SAVED_CHECKOUT_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      this.form = {
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        notes: data.notes || ''
      };
      this.saveInfo = true;
    } catch {
      // ignore bad JSON
    }
  }

  private persistInfo() {
    if (this.saveInfo) {
      localStorage.setItem(
        SAVED_CHECKOUT_KEY,
        JSON.stringify({
          name: this.form.name,
          email: this.form.email,
          phone: this.form.phone,
          address: this.form.address,
          notes: this.form.notes || ''
        })
      );
    } else {
      localStorage.removeItem(SAVED_CHECKOUT_KEY);
    }
  }

  submitOrder() {
    if (!this.form.name || !this.form.email || !this.form.phone || !this.form.address) {
      alert('Please fill all required fields');
      return;
    }

    this.loading.set(true);

    this.orderedItems = [...this.cart.items()];
    this.orderTotal = this.cart.totalPrice();

    const orderPayload = {
      name: this.form.name,
      email: this.form.email,
      phone: this.form.phone,
      address: this.form.address,
      notes: this.form.notes || '',
      total: this.orderTotal,
      items: this.orderedItems.map(i => ({
        product: i.product.id,
        variant: i.variantId || null,
        quantity: i.qty,
        price: i.price,
        flavor: i.flavor || ''
      }))
    };

    this.api.createOrder(orderPayload).subscribe({
      next: () => {
        this.persistInfo(); // save or clear based on checkbox
        this.cart.clear();
        this.orderSuccess.set(true);
        this.orderPlaced.emit();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Order failed', err);
        const msg = err?.error?.error || 'Something went wrong. Please try again.';
        alert(msg);
        this.loading.set(false);
      }
    });
  }

  finish() {
    this.orderSuccess.set(false);
    // Keep form if saved; otherwise clear
    if (!this.saveInfo) {
      this.form = { name: '', email: '', phone: '', address: '', notes: '' };
    }
    this.orderedItems = [];
    this.orderTotal = 0;
    this.close.emit();
  }
}