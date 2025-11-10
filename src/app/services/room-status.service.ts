import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RoomStatus } from '../models/room-status.model';

@Injectable({
  providedIn: 'root'
})

export class RoomStatusService {
  private apiUrl = `${environment.apiUrl}/RoomStatuses`;

  constructor(private http: HttpClient) { }

  getRoomStatuses(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getRoomStatus(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}