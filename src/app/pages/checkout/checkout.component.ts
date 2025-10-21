import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Define interfaces for better type safety
interface CartItem {
  name: string;
  price: number;
  qty: number;
}

interface CheckoutResponse {
  id: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  cart = inject(CartService);
  http = inject(HttpClient);
  private stripePromise: Promise<Stripe | null>;

  constructor() {
    // Initialize Stripe.js with the public key
    this.stripePromise = loadStripe('pk_live_51SAGlHD95CW6rARxWbjDDqV3uzMO5s3pFhqVTbuWLJflwLWGFe1ZNCFYI9d3Rg2kPlg0mhcHR5bV18s4DFqwLBvr00rHjVDENs');
  }

  async redirectToCheckout() {
    const items: CartItem[] = this.cart.cartItems().map((item: any) => ({
      name: item.name,
      price: Number(item.price),
      qty: item.qty || 1,
    }));

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<CheckoutResponse>('http://localhost:4000/checkout', { items }, { headers }).subscribe({
      next: async (res) => {
        if (res?.id) {
          const stripe = await this.stripePromise;
          if (stripe) {
            const { error } = await stripe.redirectToCheckout({ sessionId: res.id });
            if (error) {
              console.error('Stripe redirectToCheckout error:', error);
              alert('Error: Could not redirect to Stripe.');
            }
          }
        } else {
          console.error('Unexpected response:', res);
          alert('Error: Checkout Session ID not returned.');
        }
      },
      error: (err) => {
        console.error('❌ Checkout API Error:', err);
        alert('Failed to start checkout. Please try again.');
      },
    });
  }
}
