import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class ContactComponent {
  isModalVisible = false;

  constructor(private http: HttpClient) {}

  onSubmit(form: any) {
    this.http.post('/api/contact', form.value).subscribe(
      (response) => {
        console.log('Email sent successfully', response);
        form.reset();
        this.isModalVisible = true;
      },
      (error) => {
        console.error('Error sending email', error);
      }
    );
  }

  hideModal() {
    this.isModalVisible = false;
  }
}
