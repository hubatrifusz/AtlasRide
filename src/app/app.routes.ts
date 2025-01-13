import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BookingComponent } from './pages/booking/booking.component';
import { AboutComponent } from './pages/about/about.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'booking/:option', component: BookingComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' },
];

export class AppRoutingModule {}
