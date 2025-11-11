import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = `${environment.apiUrl}/Search`;
  constructor(private http: HttpClient) { }

  searchAvailableRooms(checkIn: string, checkOut: string): Observable<any> {  // Date as string YYYY-MM-DD
    let params = new HttpParams()
      .set('checkIn', checkIn)
      .set('checkOut', checkOut);

    return this.http.get<any>(this.apiUrl, { params });
  }
}
