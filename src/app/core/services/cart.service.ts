import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

export interface CartItem extends Product { qty: number; }

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>([]);

  readonly cartItems = this.items.asReadonly();
  readonly total = computed(() => this.items().reduce((sum, i) => sum + i.price * i.qty, 0));
  readonly count = computed(() => this.items().reduce((sum, i) => sum + i.qty, 0));

  add(product: Product) {
    const existing = this.items().find(i => i.id === product.id);
    if (existing) {
      this.items.update(list => list.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      this.items.update(list => [...list, { ...product, qty: 1 }]);
    }
  }

  remove(id: number) {
    this.items.update(list => list.filter(i => i.id !== id));
  }

  clear() { this.items.set([]); }
}
