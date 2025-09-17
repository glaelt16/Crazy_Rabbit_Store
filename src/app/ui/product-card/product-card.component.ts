import { Component, Input, inject } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  standalone: true,
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product!: Product;
  cart = inject(CartService);
}
