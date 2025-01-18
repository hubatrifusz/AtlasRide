import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-private-booking',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './private-booking.component.html',
  styleUrl: './private-booking.component.scss',
})
export class PrivateBookingComponent {
  lastname: string = '';
  firstname: string = '';
  email: string = '';
  phone: string = '';
  from: string = '';
  to: string = '';

  constructor(private apiService: ApiService) {}

  onSubmit() {
    const data = {
      lastname: this.lastname,
      firstname: this.firstname,
      email: this.email,
      phone: this.phone,
      from: this.from,
      to: this.to,
    };

    if (this.validate(data)) {
      this.apiService.addRide(data).subscribe(
        (data) => {
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  validate(data: {
    lastname: string;
    firstname: string;
    email: string;
    phone: string;
    from: string;
    to: string;
  }) {
    let valid = true;

    const lastnameElement = document.querySelector(
      '[name="lastname"]'
    ) as HTMLInputElement;

    const firstnameElement = document.querySelector(
      '[name="firstname"]'
    ) as HTMLInputElement;

    const emailElement = document.querySelector(
      '[name="email"]'
    ) as HTMLInputElement;

    const phoneElement = document.querySelector(
      '[name="phone"]'
    ) as HTMLInputElement;

    const fromElement = document.querySelector(
      '[name="from"]'
    ) as HTMLInputElement;

    const toElement = document.querySelector('[name="to"]') as HTMLInputElement;

    if (!data.lastname) {
      lastnameElement.classList.add('required');
      valid = false;
    }

    if (!data.firstname) {
      firstnameElement.classList.add('required');
      valid = false;
    }

    if (!data.email) {
      emailElement.classList.add('required');
      valid = false;
    }

    if (!data.phone) {
      phoneElement.classList.add('required');
      valid = false;
    }

    if (!data.from) {
      fromElement.classList.add('required');
      valid = false;
    }

    if (!data.to) {
      toElement.classList.add('required');
      valid = false;
    }

    return valid;
  }
}
