import { Component, inject } from '@angular/core';
import { NgFor, CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from '@angular/router';
import { CommonModule} from '@angular/common';

@Component({
  standalone: true,
  imports: [NgFor, CurrencyPipe, RouterLink, CommonModule],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  cart = inject(CartService);
}
