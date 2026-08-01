import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Backdrop -->
    @if (isOpen()) {
      <div 
        class="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        (click)="close.emit()">
      </div>
    }

    <!-- Drawer -->
    <div 
      class="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-50 transform transition-transform duration-300 ease-out"
      [class.translate-x-0]="isOpen()"
      [class.translate-x-full]="!isOpen()">
      
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="flex items-center justify-between p-5 border-b border-zinc-800">
          <h2 class="text-xl font-bold">Your Cart ({{ cart.totalItems() }})</h2>
          <button (click)="close.emit()" class="text-zinc-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        <!-- Items -->
        <div class="flex-1 overflow-y-auto p-5 space-y-4">
          @if (cart.items().length === 0) {
            <div class="text-center py-20 text-zinc-500">
              <p class="text-lg">Your cart is empty</p>
              <p class="text-sm mt-2">Add some products to get started</p>
            </div>
          } @else {
            @for (item of cart.items(); track item.product.id) {
              <div class="flex gap-4 bg-zinc-900 rounded-xl p-3">
                <img [src]="item.product.image" class="w-20 h-20 object-cover rounded-lg">
                <div class="flex-1">
                  <h4 class="font-medium line-clamp-1">{{ item.product.name }}</h4>
                  <p class="text-emerald-400 font-semibold mt-1">\KSH{{ item.product.price.toFixed(2) }}</p>
                  
                  <div class="flex items-center gap-3 mt-3">
                    <button (click)="cart.updateQty(item.product.id, item.qty - 1)" 
                      class="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center">−</button>
                    <span class="w-6 text-center">{{ item.qty }}</span>
                    <button (click)="cart.updateQty(item.product.id, item.qty + 1)" 
                      class="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center">+</button>
                    
                    <button (click)="cart.remove(item.product.id)" 
                      class="ml-auto text-zinc-500 hover:text-red-400 text-sm">Remove</button>
                  </div>
                </div>
              </div>
            }
          }
        </div>

        <!-- Footer -->
        @if (cart.items().length > 0) {
          <div class="p-5 border-t border-zinc-800 space-y-4">
            <div class="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span class="text-emerald-400">\KSH{{ cart.totalPrice().toFixed(2) }}</span>
            </div>
            <button 
              (click)="checkout.emit()"
              class="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3.5 rounded-xl transition active:scale-[0.98]">
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
}