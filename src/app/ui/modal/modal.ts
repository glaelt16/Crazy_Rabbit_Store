import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { ModalService } from '../../core/services/modal.service';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, NgFor, CurrencyPipe, RouterLink],
  templateUrl: './modal.html',
  styleUrls: ['./modal.scss']
})
export class ModalComponent {
  modalService = inject(ModalService);
  cartService = inject(CartService);
}
