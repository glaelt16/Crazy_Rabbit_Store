import { Component, inject, HostListener, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../ui/product-card/product-card.component';
import { CommonModule, NgFor, AsyncPipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [RouterLink, CommonModule, NgFor, AsyncPipe, ProductCardComponent],
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss'],
})
export class LandingComponent {
  private productService = inject(ProductService);
  products$ = this.productService.getAll();

  constructor(private el: ElementRef) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const componentPosition = this.el.nativeElement.querySelector('.products-section').offsetTop;
    const scrollPosition = window.pageYOffset + window.innerHeight;

    if (scrollPosition > componentPosition) {
      this.el.nativeElement.querySelector('.products-section').classList.add('visible');
    }
  }
}
