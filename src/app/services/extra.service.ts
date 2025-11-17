import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Extra } from '../models/extra.model';

@Injectable({
  providedIn: 'root'
})
export class ExtraService {
  private apiUrl = `${environment.apiUrl}/Extras`;

  constructor(private http: HttpClient) { }

  getExtras(): Observable<any> {  // Trả về ApiResponse từ HotelManagementApi
    return this.http.get<any>(this.apiUrl);
  }

  getExtra(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createExtra(extra: Extra): Observable<any> {
    return this.http.post<any>(this.apiUrl, extra);
  }

  updateExtra(id: number, extra: Extra): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, extra);
  }

  deleteExtra(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}