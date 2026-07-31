import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../data/products';

export interface CartItem {
  product: Product;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cart = signal<CartItem[]>(
    JSON.parse(localStorage.getItem('plugyard-cart') || '[]')
  );

  items = this.cart.asReadonly();

  totalItems = computed(() =>
    this.cart().reduce((sum, item) => sum + item.qty, 0)
  );

  totalPrice = computed(() =>
    this.cart().reduce((sum, item) => sum + item.product.price * item.qty, 0)
  );

  add(product: Product, qty = 1) {
    const current = [...this.cart()];
    const existing = current.find(i => i.product.id === product.id);

    if (existing) {
      existing.qty += qty;
    } else {
      current.push({ product, qty });
    }

    this.cart.set(current);
    this.save();
  }

  updateQty(id: number, qty: number) {
    if (qty <= 0) {
      this.remove(id);
      return;
    }
    const current = this.cart().map(item =>
      item.product.id === id ? { ...item, qty } : item
    );
    this.cart.set(current);
    this.save();
  }

  remove(id: number) {
    this.cart.set(this.cart().filter(i => i.product.id !== id));
    this.save();
  }

  clear() {
    this.cart.set([]);
    this.save();
  }

  private save() {
    localStorage.setItem('plugyard-cart', JSON.stringify(this.cart()));
  }
}