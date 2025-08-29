import { Component, Input, inject } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  cart = inject(CartService);
}
