import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        
        <!-- Top Row: Logo + Cart -->
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center gap-1 cursor-pointer" (click)="onSelect('all')">
            <span class="text-2xl sm:text-3xl font-black tracking-tighter text-emerald-400">PLUG</span>
            <span class="text-2xl sm:text-3xl font-light text-white">YARD</span>
          </div>

          <!-- Cart Button -->
          <button 
            (click)="openCart.emit()"
            class="relative flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 px-4 py-2.5 rounded-full border border-zinc-700 transition-all">
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

        <!-- Categories - Visible on all screens -->
        <nav class="flex gap-2 sm:gap-4 mt-4 overflow-x-auto pb-1 scrollbar-hide">
          <button 
            (click)="onSelect('all')"
            class="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition"
            [class.bg-emerald-500]="activeCategory() === 'all'"
            [class.text-black]="activeCategory() === 'all'"
            [class.text-zinc-400]="activeCategory() !== 'all'"
            [class.hover:text-emerald-400]="activeCategory() !== 'all'">
            All
          </button>

          <button 
            (click)="onSelect('vape')"
            class="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition"
            [class.bg-emerald-500]="activeCategory() === 'vape'"
            [class.text-black]="activeCategory() === 'vape'"
            [class.text-zinc-400]="activeCategory() !== 'vape'"
            [class.hover:text-emerald-400]="activeCategory() !== 'vape'">
            Vapes
          </button>

          <button 
            (click)="onSelect('eliquid')"
            class="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition"
            [class.bg-emerald-500]="activeCategory() === 'eliquid'"
            [class.text-black]="activeCategory() === 'eliquid'"
            [class.text-zinc-400]="activeCategory() !== 'eliquid'"
            [class.hover:text-emerald-400]="activeCategory() !== 'eliquid'">
            E-Liquids
          </button>

          <button 
            (click)="onSelect('bong')"
            class="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition"
            [class.bg-emerald-500]="activeCategory() === 'bong'"
            [class.text-black]="activeCategory() === 'bong'"
            [class.text-zinc-400]="activeCategory() !== 'bong'"
            [class.hover:text-emerald-400]="activeCategory() !== 'bong'">
            Bongs
          </button>

          <button 
            (click)="onSelect('accessory')"
            class="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition"
            [class.bg-emerald-500]="activeCategory() === 'accessory'"
            [class.text-black]="activeCategory() === 'accessory'"
            [class.text-zinc-400]="activeCategory() !== 'accessory'"
            [class.hover:text-emerald-400]="activeCategory() !== 'accessory'">
            Accessories
          </button>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class HeaderComponent {
  cart = inject(CartService);
  
  openCart = output<void>();
  selectCategory = output<string>();

  activeCategory = signal('all');

  onSelect(category: string) {
    this.activeCategory.set(category);
    this.selectCategory.emit(category);
  }
}