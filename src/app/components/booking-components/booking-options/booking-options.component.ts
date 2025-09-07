import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-booking-options',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './booking-options.component.html',
  styleUrl: './booking-options.component.scss',
})
export class BookingOptionsComponent {
  ngOnInit(): void {
    window.scrollTo(1, 1);
  }
}
