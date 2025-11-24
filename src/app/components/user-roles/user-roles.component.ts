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
  selectedUser: any = {};
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
  // gọi sau khi allRoles load xong
  private remapRoleNames() {
    if (!this.users || !this.allRoles) return;

    this.users = this.users.map((u: User) => {
      const roleIds = (u.userRoles || []).map((r: UserRole) =>
        typeof r.roleId === 'string' ? Number(r.roleId) : r.roleId
      );

      const roleNames = this.allRoles
        .filter(role => roleIds.includes(role.id))
        .map(role => role.name);

      return {
        ...u,
        roleIds,
        roleNames
      };
    });
  }
  loadUsers() {
    this.userService.getUsers().subscribe(response => {
      if (response.code === 200) {

        this.users = response.data.map((u: User) => {
          const roleIds = u.userRoles?.map((r: UserRole) => r.roleId) || [];

          // Map roleId → roleName bằng danh sách allRoles
          const roleNames = this.allRoles
            .filter(role => roleIds.includes(role.id))
            .map(role => role.name);

          return {
            ...u,
            roleIds,
            roleNames
          };
        });

      } else {
        this.toastr.error(response.name, 'Lỗi');
      }
    });
  }
  loadRoles() {
    this.roleService.getRoles().subscribe(response => {
      if (response.code === 200) {
        this.allRoles = response.data;
        // Khi roles đã load → remap lại users
        this.remapRoleNames();
      } else {
        this.toastr.error(response.name, 'Lỗi');
      }
    });
  }

  openRoleModal(user: User) {
  this.selectedUser = user;
  this.selectedRoleIds = [...(user.roleIds || [])]; // Clone mảng
  this.showRolePopup = true;
}

  onRoleSelectionChanged(e: any) {
    this.selectedRoleIds = e.value;  // Chỉ là danh sách ID
  }

  saveRoles() {
    this.userService.updateUserRoles(this.selectedUser.id, this.selectedRoleIds)
      .subscribe({
        next: res => {
          this.toastr.success("Cập nhật role thành công");
          this.showRolePopup = false;
          this.loadUsers(); // Reload lại grid
        },
        error: err => {
          this.toastr.error("Cập nhật thất bại");
        }
      });
  }
}