import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  product: any;
  qty: number;
  price: number;
  flavor?: string;
  variantId?: number;
  maxStock?: number;
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
    this.cart().reduce((sum, item) => sum + item.price * item.qty, 0)
  );

  add(product: any, qty = 1) {
    const price = product.price ?? product.base_price ?? 0;
    const flavor = product.flavor || '';
    const maxStock = product.maxStock ?? product.stock ?? 9999;

    const current = [...this.cart()];
    const existing = current.find(
      i => i.product.id === product.id && (i.flavor || '') === flavor
    );

    if (existing) {
      const newQty = existing.qty + qty;
      if (newQty > maxStock) {
        alert(`Only ${maxStock} left in stock`);
        existing.qty = maxStock;
      } else {
        existing.qty = newQty;
      }
    } else {
      let finalQty = qty;
      if (qty > maxStock) {
        alert(`Only ${maxStock} left in stock`);
        finalQty = maxStock;
      }
      current.push({
        product: {
          id: product.id,
          name: product.name,
          image: product.image,
          category: product.category
        },
        qty: finalQty,
        price,
        flavor,
        variantId: product.variantId,
        maxStock
      });
    }

    this.cart.set(current);
    this.saveCart();
  }

  updateQty(productId: number, flavor: string, qty: number) {
    if (qty <= 0) {
      this.remove(productId, flavor);
      return;
    }

    const current = this.cart().map(item => {
      if (item.product.id === productId && (item.flavor || '') === (flavor || '')) {
        const max = item.maxStock ?? 9999;
        if (qty > max) {
          alert(`Only ${max} left in stock`);
          return { ...item, qty: max };
        }
        return { ...item, qty };
      }
      return item;
    });

    this.cart.set(current);
    this.saveCart();
  }

  remove(productId: number, flavor: string = '') {
    this.cart.set(
      this.cart().filter(
        i => !(i.product.id === productId && (i.flavor || '') === (flavor || ''))
      )
    );
    this.saveCart();
  }

  clear() {
    this.cart.set([]);
    this.saveCart();
  }

  private saveCart() {
    localStorage.setItem('plugyard-cart', JSON.stringify(this.cart()));
  }
}