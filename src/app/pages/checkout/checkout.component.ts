import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

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
    // ✅ Map cart items to Stripe’s expected structure
    const items = this.cart.cartItems().map((item: any) => ({
      name: item.name,
      price: Number(item.price),
      qty: item.qty || 1,
    }));

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post('/api/checkout', { items }, { headers }).subscribe({
      next: (res: any) => {
        if (res?.url) {
          window.location.href = res.url; // ✅ redirect to Stripe Checkout
        } else {
          console.error('Unexpected response:', res);
          alert('Error: Checkout URL not returned.');
        }
      },
      error: (err) => {
        console.error('❌ Checkout API Error:', err);
        alert('Failed to start checkout. Please try again.');
      },
    });
  }
}
