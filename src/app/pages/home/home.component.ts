import { Component } from '@angular/core';
import { BulletinComponent } from '../../components/bulletin/bulletin.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [BulletinComponent, MatButtonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
