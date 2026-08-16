import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4">

        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-1 cursor-pointer shrink-0" (click)="goHome()">
            <span class="text-2xl sm:text-3xl font-black tracking-tighter text-emerald-400">PLUG</span>
            <span class="text-2xl sm:text-3xl font-light text-white">YARD</span>
          </div>

          <div class="hidden sm:flex flex-1 max-w-md mx-4">
            <div class="relative w-full">
              <input
                type="search"
                [(ngModel)]="searchQuery"
                (keyup.enter)="submitSearch()"
                placeholder="Search vapes, papers, brands..."
                class="w-full bg-zinc-900 border border-zinc-700 rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
              />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
              </svg>
            </div>
            <button
              type="button"
              (click)="submitSearch()"
              class="ml-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2.5 rounded-full text-sm transition shrink-0">
              Search
            </button>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              (click)="openOrders.emit()"
              class="relative flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 px-3 sm:px-4 py-2.5 rounded-full border border-zinc-700 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span class="hidden sm:inline font-medium">Orders</span>
            </button>

            <button
              type="button"
              (click)="openCart.emit()"
              class="relative flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 px-3 sm:px-4 py-2.5 rounded-full border border-zinc-700 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span class="hidden sm:inline font-medium">Cart</span>
              @if (cart.totalItems() > 0) {
                <span class="absolute -top-1.5 -right-1.5 bg-emerald-500 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {{ cart.totalItems() }}
                </span>
              }
            </button>
          </div>
        </div>

        <div class="sm:hidden mt-3 flex gap-2">
          <input
            type="search"
            [(ngModel)]="searchQuery"
            (keyup.enter)="submitSearch()"
            placeholder="Search products..."
            class="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
          />
          <button
            type="button"
            (click)="submitSearch()"
            class="bg-emerald-500 text-black font-semibold px-4 py-2 rounded-full text-sm">
            Go
          </button>
        </div>

        <div class="relative mt-4">
          <div class="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none sm:hidden"></div>
          <div class="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none sm:hidden flex items-center justify-end pr-1">
            <span class="text-zinc-500 text-sm animate-pulse">›</span>
          </div>

          <nav class="flex gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-hide px-1">
            @for (cat of categories; track cat.value) {
              <button
                type="button"
                (click)="onSelect(cat.value)"
                class="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition shrink-0"
                [class.bg-emerald-500]="activeCategory() === cat.value"
                [class.text-black]="activeCategory() === cat.value"
                [class.text-zinc-400]="activeCategory() !== cat.value"
                [class.hover:text-emerald-400]="activeCategory() !== cat.value">
                {{ cat.label }}
              </button>
            }
          </nav>
        </div>

        <p class="text-[20px] text-zinc-600 mt-1.5 sm:hidden text-center">
          ← Swipe to see more categories →
        </p>
      </div>
    </header>
  `,
  styles: [`
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class HeaderComponent {
  cart = inject(CartService);
  private api = inject(ApiService);

  openCart = output<void>();
  openOrders = output<void>();
  selectCategory = output<string>();
  search = output<string>();

  activeCategory = signal('recommended');
  searchQuery = '';

  categories = [
    { label: 'Home', value: 'recommended' },
    { label: 'Vapes', value: 'vape' },
    { label: 'E-Liquids', value: 'eliquid' },
    { label: 'Bongs', value: 'bong' },
    { label: 'Papers', value: 'rollingpaper' },
    { label: 'Cigars', value: 'cigar' },
    { label: 'Accessories', value: 'accessory' }
  ];

  onSelect(category: string) {
    this.activeCategory.set(category);
    this.searchQuery = '';
    this.selectCategory.emit(category);
  }

  goHome() {
    this.onSelect('recommended');
  }

  submitSearch() {
    const q = this.searchQuery.trim();
    if (!q) return;
    this.activeCategory.set('');
    this.search.emit(q);

    this.api.logSearch(q).subscribe({
      error: (err) => console.error('logSearch failed', err)
    });
  }
}