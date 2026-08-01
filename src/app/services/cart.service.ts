import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../data/products';

export interface CartItem {
  product: Product;
  qty: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes?: string;
  };
  status: 'Pending' | 'Received' | 'Confirmed' | 'Delivered';
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cart = signal<CartItem[]>(
    JSON.parse(localStorage.getItem('plugyard-cart') || '[]')
  );

  private orders = signal<Order[]>(
    JSON.parse(localStorage.getItem('plugyard-orders') || '[]')
  );

  items = this.cart.asReadonly();
  allOrders = this.orders.asReadonly();

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
    this.saveCart();
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
    this.saveCart();
  }

  remove(id: number) {
    this.cart.set(this.cart().filter(i => i.product.id !== id));
    this.saveCart();
  }

  clear() {
    this.cart.set([]);
    this.saveCart();
  }

  // Save a new order
  saveOrder(customer: Order['customer'], items: CartItem[], total: number) {
    const newOrder: Order = {
      id: 'ORD-' + Date.now().toString().slice(-6),
      date: new Date().toLocaleString(),
      items: [...items],
      total,
      customer,
      status: 'Received'
    };

    const updated = [newOrder, ...this.orders()];
    this.orders.set(updated);
    localStorage.setItem('plugyard-orders', JSON.stringify(updated));
  }

  private saveCart() {
    localStorage.setItem('plugyard-cart', JSON.stringify(this.cart()));
  }
}