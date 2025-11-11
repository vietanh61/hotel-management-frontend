import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/login`;  // Giả định endpoint login ở Users

  constructor(private http: HttpClient, private router: Router,) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log('Decoded token:', decoded); // Debug: Log token payload
        const expirationTime = decoded.exp * 1000;
        const currentTime = Date.now();
        console.log('Token exp:', expirationTime, 'Current time:', currentTime); // Debug
        if (expirationTime < currentTime) {
          console.log('Token expired, logging out');
          this.logout();
          return null;
        }
        return token;
      } catch (error) {
        console.error('Token decode error:', error); // Debug: Log decode error
        this.logout();
        return null;
      }
    }
    console.log('No token found in localStorage');
    return null;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}