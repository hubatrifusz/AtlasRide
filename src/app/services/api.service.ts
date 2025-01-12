import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private BASE_URL = 'https://backend-516266244601.europe-central2.run.app';

  constructor(private http: HttpClient) {}

  getRides(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/api`);
  }
}
