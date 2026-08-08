import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-orders-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

        <!-- Phone lookup -->
        <div class="p-5 border-b border-zinc-800">
          <label class="block text-sm text-zinc-400 mb-2">Enter your phone to view orders</label>
          <div class="flex gap-2">
            <input 
              [(ngModel)]="phone"
              type="text"
              placeholder="+254 7XX XXX XXX"
              class="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500">
            <button 
              (click)="loadOrders()"
              [disabled]="loading()"
              class="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2.5 rounded-xl text-sm transition disabled:opacity-50">
              {{ loading() ? '...' : 'Find' }}
            </button>
          </div>
        </div>

        <!-- Orders List -->
        <div class="flex-1 overflow-y-auto p-5 space-y-4">
          @if (loading()) {
            <div class="text-center py-10 text-zinc-500">Loading...</div>
          } @else if (!searched()) {
            <div class="text-center py-16 text-zinc-500">
              <p>Enter the phone number used when ordering</p>
            </div>
          } @else if (orders().length === 0) {
            <div class="text-center py-16 text-zinc-500">
              <p class="text-lg">No orders found</p>
              <p class="text-sm mt-2">Check the phone number and try again</p>
            </div>
          } @else {
            @for (order of orders(); track order.order_id) {
              <div class="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <p class="font-semibold text-emerald-400">{{ order.order_id }}</p>
                    <p class="text-xs text-zinc-500">{{ order.created_at | date:'medium' }}</p>
                  </div>
                  <span 
                    class="text-xs px-2 py-1 rounded-full font-medium"
                    [class.bg-yellow-500/20]="order.status === 'Received'"
                    [class.text-yellow-400]="order.status === 'Received'"
                    [class.bg-blue-500/20]="order.status === 'Confirmed'"
                    [class.text-blue-400]="order.status === 'Confirmed'"
                    [class.bg-emerald-500/20]="order.status === 'Delivered'"
                    [class.text-emerald-400]="order.status === 'Delivered'"
                    [class.bg-red-500/20]="order.status === 'Cancelled'"
                    [class.text-red-400]="order.status === 'Cancelled'">
                    {{ order.status }}
                  </span>
                </div>

                <!-- Items -->
                <div class="space-y-2 mb-3">
                  @for (item of order.items; track item.product) {
  <div class="flex justify-between text-sm">
    <span>
      {{ item.quantity }}× {{ item.product_name }}
      @if (item.flavor) {
        <span class="text-zinc-400">({{ item.flavor }})</span>
      }
    </span>
    <span class="text-emerald-400">KSH {{ item.price * item.quantity }}</span>
  </div>
}
                </div>

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
  api = inject(ApiService);

  isOpen = input(false);
  close = output<void>();

  phone = '';
  orders = signal<any[]>([]);
  loading = signal(false);
  searched = signal(false);

  private whatsappNumber = '254753492246';

  loadOrders() {
    if (!this.phone.trim()) {
      alert('Please enter your phone number');
      return;
    }

    this.loading.set(true);
    this.searched.set(true);

    this.api.getMyOrders(this.phone.trim()).subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.orders.set([]);
        this.loading.set(false);
        alert('Could not load orders. Try again.');
      }
    });
  }

  getWhatsAppLink(order: any): string {
    const message = `Hi PlugYard, I want to follow up on my order ${order.order_id}. Total: KSH ${order.total}`;
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }
}