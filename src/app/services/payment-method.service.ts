import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaymentMethod } from '../models/payment-method';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  private apiUrl = `${environment.apiUrl}/PaymentMethods`;

  constructor(private http: HttpClient) { }

  getPaymentMethods(): Observable<any> {  // Trả về ApiResponse từ HotelManagementApi
    return this.http.get<any>(this.apiUrl);
  }

  getPaymentMethod(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createPaymentMethod(hotel: PaymentMethod): Observable<any> {
    return this.http.post<any>(this.apiUrl, hotel);
  }

  updatePaymentMethod(id: number, hotel: PaymentMethod): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, hotel);
  }

  deletePaymentMethod(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}