import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  cart = inject(CartService);

  openPaymentLink() {
    // Replace with your Stripe Payment Link URL
    window.location.href = 'https://buy.stripe.com/test_XXXXXXXXXXXXXXXXXX';
  }
}
