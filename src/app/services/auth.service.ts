import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CurrentUser } from '../models/user.model'
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';  // Thêm để tap response
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/login`;  // Giả định endpoint login ở Users
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router,private toastr: ToastrService) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password }).pipe(
      tap(response => {
        if (response.code === 200) {
          //localStorage.setItem('token', response.data.token);
          //localStorage.setItem('token', response.data.token);
          //this.saveToken(response.data.token);
          //localStorage.setItem('currentUser', JSON.stringify(response.data.user));  // Lưu user info
        }
        else
        {
          this.toastr.error(response.name, 'Lỗi');
        }
      })
    );;
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
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
  setCurrentUser(user: CurrentUser | null) {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): CurrentUser | null {
    if (!this.currentUserSubject.value) {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        this.currentUserSubject.next(JSON.parse(stored));
      }
    }
    return this.currentUserSubject.value;
  }
}