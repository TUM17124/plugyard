import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm" (click)="close.emit()"></div>

      <!-- Modal -->
      <div class="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div class="bg-zinc-950 border border-zinc-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          
          <!-- Header -->
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
                <span>\KSH{{ (item.product.price * item.qty).toFixed(2) }}</span>
              </div>
            }
            <div class="flex justify-between font-bold text-lg mt-4 pt-3 border-t border-zinc-800">
              <span>Total</span>
              <span class="text-emerald-400">\KSH{{ cart.totalPrice().toFixed(2) }}</span>
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
                placeholder="+1 234 567 890">
            </div>

            <div>
              <label class="block text-sm text-zinc-400 mb-1">Delivery Address *</label>
              <textarea [(ngModel)]="form.address" name="address" required rows="3"
                class="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                placeholder="Street, City, ZIP, Country"></textarea>
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

    // Build order text
    const itemsText = this.cart.items()
      .map(i => `${i.qty}x ${i.product.name} (KSH${i.product.price})`)
      .join('\n');

    const total = this.cart.totalPrice().toFixed(2);

    // ========== FORM SUBMIT (No backend needed) ==========
    // Replace YOUR_EMAIL with your real email
    const formData = new FormData();
    formData.append('_subject', `New PlugYard Order - KSH${total}`);
    formData.append('name', this.form.name);
    formData.append('email', this.form.email);
    formData.append('phone', this.form.phone);
    formData.append('address', this.form.address);
    formData.append('notes', this.form.notes || 'None');
    formData.append('items', itemsText);
    formData.append('total', `KSH${total}`);

    try {
      await fetch('https://formsubmit.co/ajax/532995f2725a8c447f38569d1fcee84a', {
        method: 'POST',
        body: formData
      });

      this.cart.clear();
      this.orderPlaced.emit();
      this.close.emit();
      alert('✅ Order received! We will contact you soon.');
    } catch (err) {
      alert('Something went wrong. Please try again or contact us directly.');
    } finally {
      this.loading.set(false);
    }
  }
}