import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})

export class BookingService {
  private apiUrl = `${environment.apiUrl}/Bookings`;

  constructor(private http: HttpClient) { }

  // ... các method khác

  createBookingWithDetails(booking: Booking, details: any[]): Observable<any> {
    const payload = { booking, details };
    return this.http.post<any>(`${this.apiUrl}/create-with-details`, payload);
  }
}