import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RoomCategory } from '../models/room-category.model';

@Injectable({
  providedIn: 'root'
})
export class RoomCategoryService {
  private apiUrl = `${environment.apiUrl}/RoomCategories`;

  constructor(private http: HttpClient) { }

  getRoomCategories(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getRoomCategory(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createRoomCategory(roomCategory: RoomCategory): Observable<any> {
    return this.http.post<any>(this.apiUrl, roomCategory);
  }

  updateRoomCategory(id: number, roomCategory: RoomCategory): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, roomCategory);
  }

  deleteRoomCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}