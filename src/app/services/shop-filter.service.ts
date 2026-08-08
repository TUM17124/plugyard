import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ShopFilterService {
  category = signal('recommended');
  search = signal('');

  setCategory(category: string) {
    this.search.set('');
    this.category.set(category);
  }

  setSearch(q: string) {
    this.category.set('');
    this.search.set(q);
  }
}