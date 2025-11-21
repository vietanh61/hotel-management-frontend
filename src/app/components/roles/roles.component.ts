import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  roles: any[] = [];

  constructor(
    private roleService: RoleService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.roleService.getRoles().subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.roles = response.data;
        } else {
          this.toastr.error(response.message || "Có lỗi xảy ra!", "Lỗi");
        }
      },
      error: (err) => {
        console.error(err);
        // Xử lý lỗi 403 Forbidden
        if (err.status === 403) {
          this.toastr.error(
            err.error?.message || "Bạn không có quyền thực hiện hành động này",
            "403 - Forbidden"
          );
          return;
        }
        // Xử lý lỗi khác
        this.toastr.error(
          err.error?.message || "Lỗi không xác định",
          `Lỗi ${err.status}`
        );
      }
    });
  }
  onRowInserted(event: any) {
    this.roleService.createRole(event.data).subscribe(response => {
      if (response.code === 201) {
        this.loadRoles();
      } else {
        this.toastr.error(response.name, 'Lỗi');
      }
    });
  }

  onRowUpdating(event: any) {
    const updatedData = { ...event.oldData, ...event.newData };
    this.roleService.updateRole(event.oldData.id, updatedData).subscribe(response => {
      if (response.code === 200) {
        this.loadRoles();
      } else {
        this.toastr.error(response.name, 'Lỗi');
      }
    });
  }

  onRowRemoving(event: any) {
    this.roleService.deleteRole(event.data.id).subscribe(response => {
      if (response.code === 200) {
        this.loadRoles();
      } else {
        this.toastr.error(response.name, 'Lỗi');
      }
    });
  }
}