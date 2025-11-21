import { Component, OnInit } from '@angular/core';
import { HotelService } from '../../services/hotel.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.scss']
})
export class HotelsComponent implements OnInit {
  hotels: any[] = [];  // Lưu data từ ApiResponse của HotelManagementApi

  constructor(
    private hotelService: HotelService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels() {
    this.hotelService.getHotels().subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.hotels = response.data;
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
    this.hotelService.createHotel(event.data).subscribe(response => {
      if (response.code === 201) {
        this.loadHotels();  // Reload
      } else {
        alert('Lỗi: ' + response.name);
      }
    });
  }

  onRowUpdating(event: any) {
    const updatedData = { ...event.oldData, ...event.newData };
    this.hotelService.updateHotel(event.oldData.id, updatedData).subscribe(response => {
      if (response.code === 200) {
        this.loadHotels();
      } else {
        alert('Lỗi: ' + response.name);
      }
    });
  }

  onRowRemoving(event: any) {
    this.hotelService.deleteHotel(event.data.id).subscribe(response => {
      if (response.code === 200) {
        this.loadHotels();
      } else {
        alert('Lỗi: ' + response.name);
      }
    });
  }
}