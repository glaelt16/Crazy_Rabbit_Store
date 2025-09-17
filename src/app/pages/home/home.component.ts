import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../ui/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, AsyncPipe, ProductCardComponent, MatGridListModule],
})
export class HomeComponent {
  private productService = inject(ProductService);
  products$ = this.productService.getAll();
}
