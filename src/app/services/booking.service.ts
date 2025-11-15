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

  getBookings(): Observable<any> {  // Trả về ApiResponse từ HotelManagementApi
    return this.http.get<any>(this.apiUrl);
  }

  getBooking(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createBookingWithDetails(payload: { booking: Booking, details: any[] }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-with-details`, payload);
  }

  editBookingWithDetails(payload: { booking: Booking, details: any[] }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/edit-with-details`, payload);
  }
  
}