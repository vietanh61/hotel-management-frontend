import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  showModal: boolean = false;  // Control modal visibility

  constructor(private authService: AuthService, private router: Router) { }

  showLogoutModal() {
    this.showModal = true;
  }

  confirmLogout() {
    this.showModal = false;
    this.authService.logout();  // Xóa token và redirect /login
  }
}
