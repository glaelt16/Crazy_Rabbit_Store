import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './checkout.component.html',
})

export class CheckoutComponent {
  cart = inject(CartService);
  http = inject(HttpClient);

  redirectToCheckout() {
    this.http.post('/api/checkout', {
      items: this.cart.cartItems()
    }).subscribe((res: any) => {
      window.location.href = res.url;
    });
  }
}