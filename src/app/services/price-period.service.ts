import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PricePeriod } from '../models/price-periods.model';


@Injectable({
  providedIn: 'root'
})
export class PricePeriodService {
  private apiUrl = `${environment.apiUrl}/PricePeriods`;

  constructor(private http: HttpClient) { }

  getPricePeriods(): Observable<any> {  // Trả về ApiResponse từ HotelManagementApi
    return this.http.get<any>(this.apiUrl);
  }

  getPricePeriod(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createPricePeriod(pricePeriod: PricePeriod): Observable<any> {
    return this.http.post<any>(this.apiUrl, pricePeriod);
  }

  updatePricePeriod(id: number, pricePeriod: PricePeriod): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, pricePeriod);
  }

  deletePricePeriod(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}