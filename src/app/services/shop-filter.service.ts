import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ShopFilterService {
  category = signal('recommended');
  search = signal('');
}