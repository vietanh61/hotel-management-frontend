import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse, User, UserRole } from '../../models/user.model';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})

export class UserRolesComponent implements OnInit {
  users: any[] = [];
  allRoles: any[] = [];
  currentUser: any = {};
  selectedRoleIds: number[] = [];
  showRolePopup: boolean = false;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(response => {
      if (response.code === 200) {

        this.users = response.data.map((u: User) => ({
          ...u,
          roles: u.userRoles?.map((r: UserRole) => r.roleId) || []
        }));

      } else {
        this.toastr.error(response.name, 'Lỗi');
      }
    });
  }

  loadRoles() {
    this.roleService.getRoles().subscribe(response => {
      if (response.code === 200) {
        this.allRoles = response.data;
      } else {
        this.toastr.error(response.name, 'Lỗi');
      }
    });
  }

  openRoleModal(user: any) {
    this.currentUser = user;
    this.selectedRoleIds = user.roleIds || [];  // Load roles hiện tại
    this.showRolePopup = true;
  }

  onRoleSelectionChanged(event: any) {
    this.selectedRoleIds = event.selectedRowKeys;
  }

  saveUserRoles() {
    this.userService.updateUserRoles(this.currentUser.id, this.selectedRoleIds).subscribe(response => {
      if (response.code === 200) {
        this.toastr.success('Cập nhật roles thành công', 'Thành công');
        this.loadUsers();
      } else {
        this.toastr.error(response.name, 'Lỗi');
      }
      this.showRolePopup = false;
    });
  }
}