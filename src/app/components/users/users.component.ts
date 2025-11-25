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
   // ---- Popup Update Password ----
  showPasswordPopup: boolean = false;
  selectedUser: any = null;
  currentPassword: string = "";
  newPassword: string = "";
  confirmPassword: string = "";

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


  // ============================================================
  //                UPDATE PASSWORD POPUP
  // ============================================================

  openPasswordPopup(user: any) {
    this.selectedUser = user;
    this.currentPassword = "";
    this.newPassword = "";
    this.confirmPassword = "";
    this.showPasswordPopup = true;
  }

  closePopup() {
    this.showPasswordPopup = false;
  }

  savePasswordChange() {
    if (!this.newPassword || !this.confirmPassword) {
      this.toastr.error("Vui lòng nhập mật khẩu mới!", "Lỗi");
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.toastr.error("Mật khẩu mới không trùng khớp!", "Lỗi");
      return;
    }

    const req = {
      userId: this.selectedUser.id,
      newPassword: this.newPassword
    };
    console.log(this.selectedUser);
    this.userService.updatePassword(req.userId, req.newPassword).subscribe({
      next: (res: any) => {
      if (res.code === 200) {
        this.toastr.success("Cập nhật mật khẩu thành công!");
        this.showPasswordPopup = false;
      } else {
        this.toastr.error(res.name, "Lỗi");
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
          err.error?.name || "Lỗi không xác định",
          `Lỗi ${err.status}`
        );
      }
  });
  }
}