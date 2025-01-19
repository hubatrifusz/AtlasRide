import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { SuccessComponent } from '../../success/success.component';

@Component({
  selector: 'app-pet-booking',
  standalone: true,
  imports: [FormsModule, SuccessComponent],
  templateUrl: './pet-booking.component.html',
  styleUrl: './pet-booking.component.scss',
})
export class PetBookingComponent implements OnInit {

  ngOnInit(): void {
    window.scrollTo(0,0);
  }

  success: boolean = false;
  show: boolean = true;

  lastname: string = '';
  firstname: string = '';
  email: string = '';
  phone: string = '';
  from: string = '';
  to: string = '';
  baggage: boolean = false;
  return: boolean = false;
  time: string = '';
  comment: string = '';
  passangerNumber: number = 1;
  dogNumber: number = 1;
  box: boolean = false;

  constructor(private apiService: ApiService) {}

  onSubmit() {
    const data = {
      lastname: this.lastname,
      firstname: this.firstname,
      email: this.email,
      phone: this.phone,
      from: this.from,
      to: this.to,
      baggage: this.baggage,
      return: this.return,
      time: this.time,
      comment: this.comment,
      passangerNumber: this.passangerNumber,
      dogNumber: this.dogNumber,
      box: this.box,
    };

    if (this.validate(data)) {
      data.time = data.time.replace('T', ' '); //Format datetime (2025-01-04T03:30 -> 2025-01-04 03:30)

      this.apiService.addRide(data).subscribe({
        next: (response) => {
          this.success = true;
        },
        error: (error) => {
          if (error.status) {
            console.error(`Server responded with status: ${error.status}`);
          }
          console.error('Error details:', error);
        },
      });
      this.show = false;
    }
  }

  validate(data: {
    lastname: string;
    firstname: string;
    email: string;
    phone: string;
    from: string;
    to: string;
    time: string;
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

    const timeElement = document.querySelector(
      '[name="time"]'
    ) as HTMLInputElement;

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

    if (!data.time) {
      timeElement.classList.add('required');
      valid = false;
    }

    return valid;
  }
}
