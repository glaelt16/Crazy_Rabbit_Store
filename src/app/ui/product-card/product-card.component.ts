import { Component, Input, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ProductColor } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { ModalService } from '../../core/services/modal.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  cartService = inject(CartService);
  modalService = inject(ModalService);
  http = inject(HttpClient);
  selectedSize: string = '';
  selectedColor!: ProductColor;
  currentImageIndex = 0;

  ngOnInit() {
    if (this.product.colors && this.product.colors.length > 0) {
      this.selectedColor = this.product.colors[0];
    }
  }

  selectColor(color: ProductColor) {
    this.selectedColor = color;
    const imageIndex = this.product.images.indexOf(color.image);
    if (imageIndex !== -1) {
      this.currentImageIndex = imageIndex;
    }
  }

  addToCart() {
    if (this.product.sizes && !this.selectedSize) {
      alert('Please select a size.');
      return;
    }
    this.cartService.add({ ...this.product, size: this.selectedSize, color: this.selectedColor });
    this.modalService.open();
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
  }

  prevImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.product.images.length) % this.product.images.length;
  }

  notifyAmazonLinkClick() {
    this.http.post('/api/notify-amazon-click', { productName: this.product.name })
      .subscribe({
        next: () => console.log('Amazon link click notified.'),
        error: (err) => console.error('Error notifying Amazon link click:', err)
      });
  }
}
