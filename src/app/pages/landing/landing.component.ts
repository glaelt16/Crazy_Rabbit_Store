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

  ngAfterViewInit() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, options);

    observer.observe(this.el.nativeElement.querySelector('.products-section'));
  }
}
