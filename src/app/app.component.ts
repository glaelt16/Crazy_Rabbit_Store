import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './ui/navbar/navbar';
import { ModalComponent } from './ui/modal/modal';
import { Footer } from './ui/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, ModalComponent, Footer],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  getYear() {
    return new Date().getFullYear();
  }
}
