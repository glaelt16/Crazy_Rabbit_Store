import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartService } from './core/services/cart.service';
import { NavbarComponent } from './ui/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  cart = inject(CartService);

  getYear() {
    return new Date().getFullYear();
  }
}
