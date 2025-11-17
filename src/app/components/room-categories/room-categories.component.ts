import { Component, OnInit } from '@angular/core';
import { RoomCategoryService } from '../../services/room-category.service';
import { HotelService } from '../../services/hotel.service';
import { ToastrService } from 'ngx-toastr';  // Import Toastr

@Component({
  selector: 'app-room-categories',
  templateUrl: './room-categories.component.html',
  styleUrls: ['./room-categories.component.scss']
})
export class RoomCategoriesComponent {
  room_categories: any[] = [];
  hotels: any[] = [];  // Danh sách khách sạn cho dropdown

  constructor(
    private roomCategoryService: RoomCategoryService,
    private hotelService: HotelService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadRoomCategories();
    this.loadHotels();  // Load hotels cho dropdown
  }

  loadRoomCategories() {
    this.roomCategoryService.getRoomCategories().subscribe(response => {
      if (response.code === 200) {
        this.room_categories = response.data;
      } else {
        //alert(response.name);
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }
  loadHotels() {
    this.hotelService.getHotels().subscribe(response => {
      if (response.code === 200) {
        this.hotels = response.data;
      } else {
        //alert('Lỗi load khách sạn: ' + response.name);
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }
  onInitNewRow(event: any) {
    event.data.hotelId = this.hotels.length > 0 ? this.hotels[0].id : null;  // Default to first hotel if available
  }
  onRowInserted(event: any) {
    if (!event.data.hotelId) {
      //alert('Vui lòng chọn khách sạn');
      this.toastr.error('Vui lòng chọn khách sạn', 'Thông báo');
      event.cancel = true;
      return;
    }
    this.roomCategoryService.createRoomCategory(event.data).subscribe(response => {
      if (response.code === 201) {
        this.loadRoomCategories();
      } else {
        //alert('Lỗi: ' + response.name);
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }

  onRowUpdating(event: any) {
    const updatedData = { ...event.oldData, ...event.newData };
    if (!updatedData.hotelId) {
      this.toastr.error('Vui lòng chọn khách sạn', 'Thông báo');
      event.cancel = true;
      return;
    }
    this.roomCategoryService.updateRoomCategory(event.oldData.id, updatedData).subscribe(response => {
      if (response.code === 200) {
        this.loadRoomCategories();
      } else {
        //alert('Lỗi: ' + response.name);
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }

  onRowRemoving(event: any) {
    this.roomCategoryService.deleteRoomCategory(event.data.id).subscribe(response => {
      if (response.code === 200) {
        this.loadRoomCategories();
      } else {
        //alert('Lỗi: ' + response.name);
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }

  onEditorPreparing(event: any) {
    if (event.parentType === 'dataRow' && event.dataField === 'hotelId') {
      // Thay editor default bằng DxSelectBox cho chọn hotelId
      event.editorName = 'dxSelectBox';
      event.editorOptions = {
        dataSource: this.hotels,
        valueExpr: 'id',
        displayExpr: 'name',
        placeholder: 'Chọn khách sạn'
      };
    }
  }
}
