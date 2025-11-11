import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/Customers`;

  constructor(private http: HttpClient) { }

  searchCustomers(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search?query=${query}`).pipe(
      catchError(error => {
        console.error('Search Customers Error:', error);
        if (error.status === 401) {
          alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
          // Có thể gọi AuthService.logout() để redirect /login
        }
        return throwError(error);
      })
    );
  }

  createCustomer(customer: Customer): Observable<any> {
    return this.http.post<any>(this.apiUrl, customer);
  }

  
}