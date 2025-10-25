import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

export interface CartItem extends Product {
  qty: number;
  size?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>([]);

  readonly cartItems = this.items.asReadonly();
  readonly total = computed(() => this.items().reduce((sum, i) => sum + i.price * i.qty, 0));
  readonly count = computed(() => this.items().reduce((sum, i) => sum + i.qty, 0));

  add(product: Product & { size?: string }) {
    const existing = this.items().find(i => i.id === product.id && i.size === product.size);
    if (existing) {
      this.items.update(list =>
        list.map(i =>
          i.id === product.id && i.size === product.size ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      this.items.update(list => [...list, { ...product, qty: 1 }]);
    }
  }

  remove(id: number, size?: string) {
    this.items.update(list =>
      list.filter(i => !(i.id === id && i.size === size))
    );
  }

  clear() {
    this.items.set([]);
  }
}
