import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" (click)="close.emit()"></div>
    }

    <div 
      class="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-50 transform transition-transform duration-300 ease-out"
      [class.translate-x-0]="isOpen()"
      [class.translate-x-full]="!isOpen()">
      
      <div class="flex flex-col h-full">
        <div class="flex items-center justify-between p-5 border-b border-zinc-800">
          <h2 class="text-xl font-bold">Your Cart ({{ cart.totalItems() }})</h2>
          <button (click)="close.emit()" class="text-zinc-400 hover:text-white text-2xl">&times;</button>
        </div>

        <div class="flex-1 overflow-y-auto p-5 space-y-4">
          @if (cart.items().length === 0) {
            <div class="text-center py-20 text-zinc-500">
              <p class="text-lg">Your cart is empty</p>
              <p class="text-sm mt-2">Add some products to get started</p>
            </div>
          } @else {
            @for (item of cart.items(); track trackItem(item)) {
              <div class="flex gap-4 bg-zinc-900 rounded-xl p-3">
                <img
  [src]="item.image || item.product.image"
  [alt]="item.product.name"
  class="w-20 h-20 object-contain rounded-lg bg-zinc-800">
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium line-clamp-1">{{ item.product.name }}</h4>
                  
                  @if (item.flavor) {
                    <p class="text-xs text-emerald-400 mt-0.5">{{ item.flavor }}</p>
                  }

                  <p class="text-emerald-400 font-semibold mt-1">KSH {{ formatPrice(item.price ) }}</p>
                  
                  <div class="flex items-center gap-3 mt-3">
                    <button (click)="cart.updateQty(item.product.id, item.flavor || '', item.qty - 1)" 
                      class="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center">−</button>
                    <span class="w-6 text-center">{{ item.qty }}</span>
                    <button (click)="cart.updateQty(item.product.id, item.flavor || '', item.qty + 1)" 
                      class="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center">+</button>
                    
                    <button (click)="cart.remove(item.product.id, item.flavor || '')" 
                      class="ml-auto text-zinc-500 hover:text-red-400 text-sm">Remove</button>
                  </div>
                </div>
              </div>
            }
          }
        </div>

        @if (cart.items().length > 0) {
          <div class="p-5 border-t border-zinc-800 space-y-4">
            <div class="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span class="text-emerald-400">KSH {{ formatPrice(cart.totalPrice()) }}</span>
            </div>
            <button 
              (click)="checkout.emit()"
              class="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3.5 rounded-xl transition">
              Proceed to Checkout
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class CartDrawerComponent {
  cart = inject(CartService);
  isOpen = input(false);
  close = output<void>();
  checkout = output<void>();

  trackItem(item: any) {
    return item.product.id + '_' + (item.flavor || '');
  }

  formatPrice(value: number | string | null | undefined): string {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) return '0';
  return n.toLocaleString('en-KE'); // 1200 → 1,200
}
}