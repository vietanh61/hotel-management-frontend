import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private toastr: ToastrService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    console.log('Interceptor: Request URL:', req.url);
    console.log('Interceptor: Token:', token ? 'Present' : 'Missing');
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Interceptor: HTTP Error:', error);
        if (error.status === 401) {
          this.toastr.error('Không được phép truy cập. Vui lòng đăng nhập lại.', 'Lỗi');
          // Remove automatic logout to allow component-specific handling
          // this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}