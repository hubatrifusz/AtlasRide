import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-private-booking',
  standalone: true,
  imports: [],
  templateUrl: './private-booking.component.html',
  styleUrl: './private-booking.component.scss',
})
export class PrivateBookingComponent implements OnInit {
  rides: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchRides();
  }

  fetchRides(): void {
    this.apiService.getRides().subscribe(
      (data) => {
        console.log('Rides:', data);
        this.rides = data;
      },
      (error) => {
        console.error('Error fetching rides:', error);
      }
    );
  }
}
