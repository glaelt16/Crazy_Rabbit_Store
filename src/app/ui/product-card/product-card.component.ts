import { Component, Input, inject, OnInit } from '@angular/core';
import { Product, ProductColor } from '../../core/models/product.model';
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
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  cartService = inject(CartService);
  modalService = inject(ModalService);
  selectedSize: string = '';
  selectedColor!: ProductColor;
  displayImage!: string;

  ngOnInit() {
    if (this.product.colors && this.product.colors.length > 0) {
      this.selectedColor = this.product.colors[0];
    }
    this.displayImage = this.product.image;
  }

  selectColor(color: ProductColor) {
    this.selectedColor = color;
    this.displayImage = color.image;
  }

  addToCart() {
    if (this.product.sizes && !this.selectedSize) {
      alert('Please select a size.');
      return;
    }
    this.cartService.add({ ...this.product, size: this.selectedSize, color: this.selectedColor });
    this.modalService.open();
  }
}
