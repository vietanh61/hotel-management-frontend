import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ExtraUnit } from '../models/extra-unit.model';

@Injectable({
  providedIn: 'root'
})
export class ExtraUnitService {
  private apiUrl = `${environment.apiUrl}/ExtraUnits`;

  constructor(private http: HttpClient) { }

  getExtraUnits(): Observable<any> {  // Trả về ApiResponse từ HotelManagementApi
    return this.http.get<any>(this.apiUrl);
  }

  getExtraUnit(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createExtraUnit(extra: ExtraUnit): Observable<any> {
    return this.http.post<any>(this.apiUrl, extra);
  }

  updateExtraUnit(id: number, extra: ExtraUnit): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, extra);
  }

  deleteExtraUnit(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}