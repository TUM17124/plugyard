import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-orders-drawer',
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
        <!-- Header -->
        <div class="flex items-center justify-between p-5 border-b border-zinc-800">
          <h2 class="text-xl font-bold">My Orders</h2>
          <button (click)="close.emit()" class="text-zinc-400 hover:text-white text-2xl">&times;</button>
        </div>

        <!-- Orders List -->
        <div class="flex-1 overflow-y-auto p-5 space-y-4">
          @if (cart.allOrders().length === 0) {
            <div class="text-center py-20 text-zinc-500">
              <p class="text-lg">No orders yet</p>
              <p class="text-sm mt-2">Your past orders will appear here</p>
            </div>
          } @else {
            @for (order of cart.allOrders(); track order.id) {
              <div class="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                
                <!-- Order Header -->
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <p class="font-semibold text-emerald-400">{{ order.id }}</p>
                    <p class="text-xs text-zinc-500">{{ order.date }}</p>
                  </div>
                  <span 
                    class="text-xs px-2 py-1 rounded-full font-medium"
                    [class.bg-yellow-500/20]="order.status === 'Pending'"
                    [class.text-yellow-400]="order.status === 'Pending'"
                    [class.bg-emerald-500/20]="order.status === 'Received'"
                    [class.text-emerald-400]="order.status === 'Received'"
                    [class.bg-blue-500/20]="order.status === 'Confirmed'"
                    [class.text-blue-400]="order.status === 'Confirmed'"
                    [class.bg-purple-500/20]="order.status === 'Delivered'"
                    [class.text-purple-400]="order.status === 'Delivered'">
                    {{ order.status }}
                  </span>
                </div>

                <!-- Items -->
                <div class="space-y-3 mb-3">
                  @for (item of order.items; track item.product.id) {
                    <div class="flex gap-3 text-sm items-center">
                      <img 
                        [src]="item.product.image" 
                        [alt]="item.product.name"
                        class="w-12 h-12 object-cover rounded-lg bg-zinc-800 shrink-0"
                        onerror="this.src='https://via.placeholder.com/48?text=No+Img'">
                      
                      <div class="flex-1 min-w-0">
                        <p class="line-clamp-1 font-medium">{{ item.product.name }}</p>
                        <p class="text-zinc-400 text-xs">Qty: {{ item.qty }}</p>
                      </div>
                      
                      <p class="text-emerald-400 font-medium shrink-0">
                        KSH {{ (item.product.price * item.qty) }}
                      </p>
                    </div>
                  }
                </div>

                <!-- Total + Follow Up -->
                <div class="flex justify-between items-center pt-3 border-t border-zinc-800">
                  <span class="font-bold">
                    Total: <span class="text-emerald-400">KSH {{ order.total }}</span>
                  </span>
                  
                  <a 
                    [href]="getWhatsAppLink(order)"
                    target="_blank"
                    class="text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-3 py-1.5 rounded-full transition">
                    Follow Up
                  </a>
                </div>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `
})
export class OrdersDrawerComponent {
  cart = inject(CartService);
  isOpen = input(false);
  close = output<void>();

  private whatsappNumber = '254753492246';

  getWhatsAppLink(order: any): string {
    const message = `Hi PlugYard, I want to follow up on my order ${order.id}. Total: KSH ${order.total}`;
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }
}