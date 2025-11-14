import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BookingStatus } from '../models/booking-status.model';

@Injectable({
  providedIn: 'root'
})
export class BookingStatusService {

  private apiUrl = `${environment.apiUrl}/BookingStatuses`;

  constructor(private http: HttpClient) { }

  getBookingStatuses(): Observable<any> {  // Trả về ApiResponse từ BookingStatusManagementApi
    return this.http.get<any>(this.apiUrl);
  }

  getBookingStatus(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createBookingStatus(hotel: BookingStatus): Observable<any> {
    return this.http.post<any>(this.apiUrl, hotel);
  }

  updateBookingStatus(id: number, hotel: BookingStatus): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, hotel);
  }

  deleteBookingStatus(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}