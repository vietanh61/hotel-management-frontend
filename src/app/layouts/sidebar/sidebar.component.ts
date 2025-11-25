import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CurrentUser } from '../../models/user.model'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  showModal: boolean = false;  // Control modal visibility
  fullName: string | null = '';
  currUser: CurrentUser | null = null ;
  constructor(public authService: AuthService, private router: Router) { }
  ngOnInit(): void {
    //this.currUser = this.authService.getCurrentUser();
    //this.fullName = this.currUser?.fullName;
    //console.log(this.currUser);
  }

  showLogoutModal() {
    this.showModal = true;
  }

  confirmLogout() {
    this.showModal = false;
    this.authService.logout();  // Xóa token và redirect /login
  }
}
