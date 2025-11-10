import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'HotelManagementFrontend';
  isLoginPage = false;
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // kiểm tra xem route hiện tại có phải login không
        this.isLoginPage = event.urlAfterRedirects.includes('/login');
      }
    });
  }
}
