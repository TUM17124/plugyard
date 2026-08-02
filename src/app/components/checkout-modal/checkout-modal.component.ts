import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm" (click)="!orderSuccess() && close.emit()"></div>

      <!-- Modal -->
      <div class="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div class="bg-zinc-950 border border-zinc-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          
          @if (!orderSuccess()) {
            <!-- ========== CHECKOUT FORM ========== -->
            <div class="flex items-center justify-between p-5 border-b border-zinc-800">
              <h2 class="text-xl font-bold">Checkout</h2>
              <button (click)="close.emit()" class="text-zinc-400 hover:text-white text-2xl">&times;</button>
            </div>

            <!-- Order Summary -->
            <div class="p-5 border-b border-zinc-800">
              <h3 class="font-semibold mb-3 text-zinc-300">Order Summary</h3>
              @for (item of cart.items(); track item.product.id) {
                <div class="flex justify-between text-sm mb-2">
                  <span>{{ item.qty }}× {{ item.product.name }}</span>
                  <span>KSH {{ item.product.price * item.qty }}</span>
                </div>
              }
              <div class="flex justify-between font-bold text-lg mt-4 pt-3 border-t border-zinc-800">
                <span>Total</span>
                <span class="text-emerald-400">KSH {{ cart.totalPrice() }}</span>
              </div>
            </div>

            <!-- Form -->
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
                  placeholder="Street, City, Area">
                </textarea>
              </div>

              <div>
                <label class="block text-sm text-zinc-400 mb-1">Notes (optional)</label>
                <input [(ngModel)]="form.notes" name="notes"
                  class="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                  placeholder="Any special request?">
              </div>

              <button type="submit" [disabled]="loading()"
                class="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-3.5 rounded-xl transition">
                {{ loading() ? 'Sending Order...' : 'Place Order' }}
              </button>

              <p class="text-xs text-zinc-500 text-center">
                We will contact you shortly to confirm payment & delivery.
              </p>
            </form>

          } @else {
            <!-- ========== ORDER CONFIRMATION ========== -->
            <div class="p-6 text-center">
              <div class="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 class="text-2xl font-bold mb-2">Order Received!</h2>
              <p class="text-zinc-400 mb-6">Thank you {{ form.name }}. We will contact you soon.</p>

              <!-- Ordered Items -->
              <div class="bg-zinc-900 rounded-xl p-4 text-left mb-6">
                <h3 class="font-semibold text-zinc-300 mb-3">Items Ordered</h3>
                
                @for (item of orderedItems; track item.product.id) {
                  <div class="flex gap-3 mb-3 last:mb-0 items-center">
                    <img [src]="item.product.image" 
                         class="w-14 h-14 object-cover rounded-lg bg-zinc-800"
                         [alt]="item.product.name">
                    <div class="flex-1">
                      <p class="font-medium text-sm">{{ item.product.name }}</p>
                      <p class="text-zinc-400 text-xs">Qty: {{ item.qty }}</p>
                    </div>
                    <p class="text-emerald-400 font-medium text-sm">
                      KSH {{ item.product.price * item.qty }}
                    </p>
                  </div>
                }

                <div class="flex justify-between font-bold mt-4 pt-3 border-t border-zinc-700">
                  <span>Total</span>
                  <span class="text-emerald-400">KSH {{ orderTotal }}</span>
                </div>
              </div>

              <button 
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
  isOpen = input(false);
  close = output<void>();
  orderPlaced = output<void>();

  loading = signal(false);
  orderSuccess = signal(false);

  orderedItems: CartItem[] = [];
  orderTotal = 0;

  form = {
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  };

  async submitOrder() {
    if (!this.form.name || !this.form.email || !this.form.phone || !this.form.address) {
      alert('Please fill all required fields');
      return;
    }

    this.loading.set(true);

    // 1. Copy cart data FIRST
    this.orderedItems = [...this.cart.items()];
    this.orderTotal = this.cart.totalPrice();

    // 2. Save order to "My Orders" (with real data)
    this.cart.saveOrder(
      {
        name: this.form.name,
        email: this.form.email,
        phone: this.form.phone,
        address: this.form.address,
        notes: this.form.notes
      },
      this.orderedItems,
      this.orderTotal
    );

    // 3. Prepare email data
    const itemsText = this.orderedItems
      .map(i => `${i.qty}x ${i.product.name} (KSH ${i.product.price})`)
      .join('\n');

    const formData = new FormData();
    formData.append('_subject', `New PlugYard Order - KSH ${this.orderTotal}`);
    formData.append('name', this.form.name);
    formData.append('email', this.form.email);
    formData.append('phone', this.form.phone);
    formData.append('address', this.form.address);
    formData.append('notes', this.form.notes || 'None');
    formData.append('items', itemsText);
    formData.append('total', `KSH ${this.orderTotal}`);

    try {
      // ⚠️ Use your real email here
      await fetch('https://formsubmit.co/ajax/532995f2725a8c447f38569d1fcee84a', {
        method: 'POST',
        body: formData
      });

      // 4. Clear cart and show success
      this.cart.clear();
      this.orderSuccess.set(true);
      this.orderPlaced.emit();
    } catch (err) {
      alert('Something went wrong. Please try again or contact us on WhatsApp.');
    } finally {
      this.loading.set(false);
    }
  }

  finish() {
    this.orderSuccess.set(false);
    this.form = { name: '', email: '', phone: '', address: '', notes: '' };
    this.orderedItems = [];
    this.orderTotal = 0;
    this.close.emit();
  }
}