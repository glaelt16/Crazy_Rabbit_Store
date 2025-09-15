import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './ui/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  getYear() {
    return new Date().getFullYear();
  }
}
