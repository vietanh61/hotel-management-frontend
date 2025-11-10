import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Hotel } from '../models/hotel.model';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = `${environment.apiUrl}/Hotels`;

  constructor(private http: HttpClient) { }

  getHotels(): Observable<any> {  // Trả về ApiResponse từ HotelManagementApi
    return this.http.get<any>(this.apiUrl);
  }

  getHotel(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createHotel(hotel: Hotel): Observable<any> {
    return this.http.post<any>(this.apiUrl, hotel);
  }

  updateHotel(id: number, hotel: Hotel): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, hotel);
  }

  deleteHotel(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}