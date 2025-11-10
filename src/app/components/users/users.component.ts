import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
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

  onRowInserted(event: any) {
    this.userService.createUser(event.data).subscribe(response => {
      if (response.code === 201) {
        this.loadUsers();
      } else {
        alert('Lỗi: ' + response.name);
      }
    });
  }

  onRowUpdating(event: any) {
    const updatedData = { ...event.oldData, ...event.newData };
    this.userService.updateUser(event.oldData.id, updatedData).subscribe(response => {
      if (response.code === 200) {
        this.loadUsers();
      } else {
        alert('Lỗi: ' + response.name);
      }
    });
  }

  onRowRemoving(event: any) {
    this.userService.deleteUser(event.data.id).subscribe(response => {
      if (response.code === 200) {
        this.loadUsers();
      } else {
        alert('Lỗi: ' + response.name);
      }
    });
  }
}