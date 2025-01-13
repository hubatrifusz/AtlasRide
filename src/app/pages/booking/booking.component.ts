import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrivateBookingComponent } from "../../components/booking-components/private-booking/private-booking.component";

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [PrivateBookingComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent {
  currentPage: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.currentPage = params.get('option');
    });
  }
}
