import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BookingComponent } from './pages/booking/booking.component';
import { AboutComponent } from './pages/about/about.component';
import { BookingOptionsComponent } from './components/booking-components/booking-options/booking-options.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'booking/:option', component: BookingComponent },
  { path: 'about', component: AboutComponent },
  { path: 'booking-options', component: BookingOptionsComponent },
  { path: '**', redirectTo: '' },
];

export class AppRoutingModule {}
