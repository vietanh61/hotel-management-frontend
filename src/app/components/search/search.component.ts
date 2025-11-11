import { Component } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';  // Import Toastr

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent {
  checkIn: string = '';  // YYYY-MM-DD
  checkOut: string = '';
  rooms: any[] = [];
  selectedRooms: any[] = [];

  constructor(private searchService: SearchService, private router: Router,private toastr: ToastrService) { }

  search() {
    if (!this.checkIn || !this.checkOut || new Date(this.checkIn) >= new Date(this.checkOut)) {
      //alert('Vui lòng chọn ngày hợp lệ');
      this.toastr.error('Vui lòng chọn ngày hợp lệ', 'Thông báo');
      return;
    }
    this.searchService.searchAvailableRooms(this.checkIn, this.checkOut).subscribe(response => {
      if (response.code === 200) {
        this.rooms = response.data;
      } else {
        //alert(response.name);
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }

  onSelectionChanged(event: any) {
    this.selectedRooms = event.selectedRowsData;
  }

  proceedToBooking() {
    // Navigate sang trang đặt phòng với selectedRooms
    this.router.navigate(['/create-booking'], { state: { selectedRooms: this.selectedRooms, checkIn: this.checkIn, checkOut: this.checkOut } });
  }
}