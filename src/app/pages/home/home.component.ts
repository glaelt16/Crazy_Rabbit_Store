import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../ui/product-card/product-card.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [NgFor, AsyncPipe, ProductCardComponent, CommonModule]
})
export class HomeComponent {
  private productService = inject(ProductService);
  products$ = this.productService.getAll();
}
