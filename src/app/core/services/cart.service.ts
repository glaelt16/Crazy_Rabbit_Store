import { Injectable, signal, computed } from '@angular/core';
import { Product, ProductColor } from '../models/product.model';

export interface CartItem extends Product {
  qty: number;
  size?: string;
  color?: ProductColor;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>([]);

  readonly cartItems = this.items.asReadonly();
  readonly total = computed(() => this.items().reduce((sum, i) => sum + i.price * i.qty, 0));
  readonly count = computed(() => this.items().reduce((sum, i) => sum + i.qty, 0));

  add(product: Product & { size?: string; color?: ProductColor }) {
    const existing = this.items().find(i => i.id === product.id && i.size === product.size && i.color === product.color);
    if (existing) {
      this.items.update(list =>
        list.map(i =>
          i.id === product.id && i.size === product.size && i.color === product.color
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      );
    } else {
      this.items.update(list => [...list, { ...product, qty: 1 }]);
    }
  }

  remove(id: number, size?: string, color?: ProductColor) {
    this.items.update(list =>
      list.filter(i => !(i.id === id && i.size === size && i.color === color))
    );
  }

  clear() {
    this.items.set([]);
  }
}
