import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';  // Import Toastr
import { HotelService } from 'src/app/services/hotel.service';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  hotels: any[] = [];  // Danh sách khách sạn cho dropdown
  roles: any[] = [];  // Danh sách khách sạn cho dropdown
  constructor(
    private userService: UserService,
    private hotelService: HotelService,
    private roleService: RoleService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    this.loadHotels();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(response => {
      if (response.code === 200) {
        this.users = response.data;
      } else {
        alert(response.name);
      }
    });
  }
  loadHotels() {
    this.hotelService.getHotels().subscribe(response => {
      if (response.code === 200) {
        this.hotels = response.data;
      } else {
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }
  loadRoles() {
    this.roleService.getRoles().subscribe(response => {
      if (response.code === 200) {
        this.roles = response.data;
      } else {
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }
  onInitNewRow(event: any) {
    event.data.hotelId = this.hotels.length > 0 ? this.hotels[0].id : null;  // Default to first hotel if available
    event.data.roleId = this.roles.length > 0 ? this.roles[0].id : null;  // Default to first hotel if available
  }
  onRowInserting(event: any) {
    if (!event.data.hotelId) {
      this.toastr.error('Vui lòng chọn khách sạn', 'Thông báo');
      event.cancel = true; // NGĂN popup đóng
      return;
    }

    this.userService.createUser(event.data).subscribe(response => {
      if (response.code === 201) {
        this.loadUsers();
      } else {
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }

  onRowUpdating(event: any) {
    const updatedData = { ...event.oldData, ...event.newData };
    if (!updatedData.hotelId) {
      this.toastr.error('Vui lòng chọn khách sạn', 'Thông báo');
      event.cancel = true; // KHÔNG cho popup đóng
      return;
    }

    this.userService.updateUser(event.oldData.id, updatedData).subscribe(response => {
      if (response.code === 200) {
        this.loadUsers();
      } else {
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }

  onRowRemoving(event: any) {
    this.userService.deleteUser(event.data.id).subscribe(response => {
      if (response.code === 200) {
        this.loadUsers();
      } else {
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }
}