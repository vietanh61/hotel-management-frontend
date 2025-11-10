import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  roles: any[] = [];

  constructor(private roleService: RoleService) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.roleService.getRoles().subscribe(response => {
      if (response.code === 200) {
        this.roles = response.data;
      } else {
        alert(response.name);
      }
    });
  }

  onRowInserted(event: any) {
    this.roleService.createRole(event.data).subscribe(response => {
      if (response.code === 201) {
        this.loadRoles();
      } else {
        alert('Lỗi: ' + response.name);
      }
    });
  }

  onRowUpdating(event: any) {
    const updatedData = { ...event.oldData, ...event.newData };
    this.roleService.updateRole(event.oldData.id, updatedData).subscribe(response => {
      if (response.code === 200) {
        this.loadRoles();
      } else {
        alert('Lỗi: ' + response.name);
      }
    });
  }

  onRowRemoving(event: any) {
    this.roleService.deleteRole(event.data.id).subscribe(response => {
      if (response.code === 200) {
        this.loadRoles();
      } else {
        alert('Lỗi: ' + response.name);
      }
    });
  }
}