import { Component, Input, inject } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { ModalService } from '../../core/services/modal.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  cartService = inject(CartService);
  modalService = inject(ModalService);
  selectedSize: string = '';

  addToCart() {
    if (this.product.sizes && !this.selectedSize) {
      alert('Please select a size.');
      return;
    }
    this.cartService.add({ ...this.product, size: this.selectedSize });
    this.modalService.open();
  }
}
