import { Component, OnInit } from '@angular/core';
import { HotelService } from '../../services/hotel.service';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.scss']
})
export class HotelsComponent implements OnInit {
  hotels: any[] = [];  // Lưu data từ ApiResponse của HotelManagementApi

  constructor(private hotelService: HotelService) { }

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels() {
    this.hotelService.getHotels().subscribe(response => {
      if (response.code === 200) {
        this.hotels = response.data;
      } else {
        alert(response.name);  // Xử lý lỗi
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