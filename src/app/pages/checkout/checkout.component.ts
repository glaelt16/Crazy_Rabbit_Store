import { Component, inject  } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  standalone: true,
   imports: [CommonModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  cart = inject(CartService);

  openPaymentLink() {
    // Replace with your Stripe Payment Link URL
    window.location.href = 'https://buy.stripe.com/test_XXXXXXXXXXXXXXXXXX';
  }
}
