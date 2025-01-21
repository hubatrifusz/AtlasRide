import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { SuccessComponent } from '../../server-responses/success/success.component';

@Component({
  selector: 'app-pet-booking',
  standalone: true,
  imports: [FormsModule, SuccessComponent],
  templateUrl: './pet-booking.component.html',
  styleUrl: './pet-booking.component.scss',
})
export class PetBookingComponent implements OnInit {
  ngOnInit(): void {
    window.scrollTo(0, 0);
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

      this.apiService
        .sendCustomerEmail(this.makeCustomerEmail(data))
        .subscribe({
          next: (response) => {},
          error: (error) => {
            if (error.status) {
              console.error(`Server responded with status: ${error.status}`);
            }
            console.error('Error details:', error);
          },
        });

      this.apiService.sendAdminEmail(this.makeAdminEmail(data)).subscribe({
        next: (response) => {},
        error: (error) => {
          if (error.status) {
            console.error(`Server responded with status: ${error.status}`);
          }
          console.error('Error details:', error);
        },
      });
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

  makeCustomerEmail(data: {
    lastname: string;
    firstname: string;
    email: string;
    from: string;
    to: string;
    time: string;
  }) {
    const emailData = {
      to: data.email,
      subject: 'Atlas Ride foglalás visszaigazolás',
      html: `<div>
        <h2>Foglalás megerősítése – Köszönjük, hogy minket választott!</h2>

        <p>Kedves ${data.lastname} ${data.firstname}!</p>

        <p>Örömmel értesítjük, hogy a foglalása sikeresen rögzítésre került. Az alábbiakban találja a részleteket:</p>

        <p><strong>Foglalás adatai:</strong></p>
        <ul>
            <li><strong>Indulás időpontja:</strong> ${data.time}</li>
            <li><strong>Indulási hely:</strong> ${data.from}</li>
            <li><strong>Célállomás:</strong> ${data.to}</li>
        </ul>

        <p>Bízunk benne, hogy kényelmes és biztonságos utazásban lesz része. Ha bármilyen kérdése van a foglalással kapcsolatban, ne habozzon felvenni velünk a kapcsolatot a <b>info@atlasride.hu</b> email címen vagy a <b>+36 70 600 5522</b> telefonszámon.</p>

        <p>Köszönjük, hogy minket választott, és várjuk, hogy segíthessünk az utazásában!</p>

        <div>
            <p>Üdvözlettel,<br><span>Baranyai Péter</span><br>Atlas Ride<br>+36 70 600 5522<br>info@atlasride.hu<br><a href="atlasride.hu">Weboldalunk</a></p>
        </div>
    </div>`,
    };

    return emailData;
  }

  makeAdminEmail(data: {
    lastname: string;
    firstname: string;
    email: string;
    phone: string;
    from: string;
    to: string;
    baggage: boolean;
    return: boolean;
    time: string;
    comment: string;
    passangerNumber: number;
    dogNumber: number;
    box: boolean;
  }) {
    const adminEmailData = {
      to: 'info@atlasride.hu',
      subject: 'Új foglalás érkezett',
      html: ` <p>Új foglalás érkezett, az alábbi adatokkal:</p>

        <p><strong>Foglalás adatai:</strong></p>
        <ul>
            <li><strong>Név:</strong> ${data.lastname} ${data.firstname}</li>
            <li><strong>Email cím:</strong> ${data.email}</li>
            <li><strong>Telefonszám:</strong> ${data.phone}</li>
            <li><strong>Indulási hely:</strong> ${data.from}</li>
            <li><strong>Célállomás:</strong> ${data.to}</li>
            <li><strong>Poggyász:</strong> ${data.baggage ? 'Igen' : 'Nem'}</li>
            <li><strong>Visszaút:</strong> ${data.return ? 'Igen' : 'Nem'}</li>
            <li><strong>Időpont:</strong> ${data.time}</li>
            <li><strong>Megjegyzés:</strong> ${data.comment}</li>
            <li><strong>Utazók száma:</strong> ${data.passangerNumber}</li>
            <li><strong>Kutyák száma:</strong> ${data.dogNumber}</li>
            <li><strong>Boxos utazást ismeri:</strong> ${
              data.box ? 'Igen' : 'Nem'
            }</li>
        </ul>`,
    };

    return adminEmailData;
  }
}
