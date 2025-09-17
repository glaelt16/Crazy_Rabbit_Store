import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    RouterLink,
    MatListModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  cart = inject(CartService);
}
