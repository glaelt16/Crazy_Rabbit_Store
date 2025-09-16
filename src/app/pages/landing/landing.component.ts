import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  
})
export class LandingComponent {
  defaultImage: string = '../src/assets/CrazyRabbit.png';
}
