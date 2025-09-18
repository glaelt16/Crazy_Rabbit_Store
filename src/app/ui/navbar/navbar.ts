import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  private cart = inject(CartService);

  menuOpen = signal(false);
  cartCount = this.cart.count;

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }
}