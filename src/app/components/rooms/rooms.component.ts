import { Component } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { RoomCategoryService } from '../../services/room-category.service';
import { HotelService } from '../../services/hotel.service';
import { RoomStatusService } from '../../services/room-status.service';
import { ToastrService } from 'ngx-toastr';  // Import Toastr
@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})

export class RoomsComponent {
  rooms: any[] = [];
  room_categories: any[] = [];// Danh sách hạng phòng cho dropdown
  hotels: any[] = [];  // Danh sách khách sạn cho dropdown
  roomStatuses: any[] = [];  // Danh sách trạng thái cho dropdown

  constructor(
    private roomService: RoomService,
    private roomCategoryService: RoomCategoryService,
    private hotelService: HotelService,
    private roomStatusService: RoomStatusService,
    private toastr: ToastrService  // Inject Toastr
  ) { }

  ngOnInit(): void {
    this.loadRooms();
    this.loadRoomCategories();
    this.loadHotels();  // Load hotels cho dropdown
    this.loadRoomStatuses();
  }
loadRooms() {
    this.roomService.getRooms().subscribe(response => {
      if (response.code === 200) {
        this.rooms = response.data;
      } else {
        //alert(response.name);
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }
loadRoomCategories() {
    this.roomCategoryService.getRoomCategories().subscribe(response => {
      if (response.code === 200) {
        this.room_categories = response.data;
      } else {
        // alert(response.name);
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }
loadHotels() {
    this.hotelService.getHotels().subscribe(response => {
      if (response.code === 200) {
        this.hotels = response.data;
      } else {
        // alert('Lỗi load khách sạn: ' + response.name);
        this.toastr.error(response.name, 'Lỗi load khách sạn');
      }
    });
  }
loadRoomStatuses() {
    this.roomStatusService.getRoomStatuses().subscribe(response => {
      if (response.code === 200) {
        this.roomStatuses = response.data;
      } else {
        //alert('Lỗi load trạng thái: ' + response.name);
        this.toastr.error(response.name, 'Lỗi load trạng thái');
      }
    });
  }
  onInitNewRow(event: any) {
    event.data.hotelId = this.hotels.length > 0 ? this.hotels[0].id : null;  // Default to first hotel if available
    event.data.categoryId = this.room_categories.length > 0 ? this.room_categories[0].id : null;  // Default to first room_categories if available
    event.data.statusId = this.roomStatuses.length > 0 ? this.roomStatuses[0].id : null;  // Default to first roomStatuses if available
  }
  onRowInserted(event: any) {
    if (!event.data.hotelId) {
      //alert('Vui lòng chọn khách sạn');
      this.toastr.error('Vui lòng chọn khách sạn', 'Thông báo');
      event.cancel = true;
      return;
    }
    if (!event.data.categoryId) {
      //alert('Vui lòng chọn hạng phòng');
      this.toastr.error('Vui lòng chọn hạng phòng', 'Thông báo');
      event.cancel = true;
      return;
    }
    if (!event.data.statusId) {
      // alert('Vui lòng chọn trạng thái phòng');
      this.toastr.error('Vui lòng chọn trạng thái phòng', 'Thông báo');
      event.cancel = true;
      return;
    }
    this.roomService.createRoom(event.data).subscribe(response => {
      if (response.code === 201) {
        this.toastr.success('Tạo mới thành công');
        this.loadRooms();
      } else {
        //alert('Lỗi: ' + response.name);
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }

  onRowUpdating(event: any) {
    const updatedData = { ...event.oldData, ...event.newData };
    if (!updatedData.hotelId) {
      //alert('Vui lòng chọn khách sạn');
      this.toastr.error('Vui lòng chọn khách sạn', 'Thông báo');
      event.cancel = true;
      return;
    }
    if (!updatedData.categoryId) {
      // alert('Vui lòng chọn hạng phòng');
      this.toastr.error('Vui lòng chọn hạng phòng', 'Thông báo');
      event.cancel = true;
      return;
    }
    if (!updatedData.statusId) {
      //alert('Vui lòng chọn trạng thái phòng');
      this.toastr.error('Vui lòng chọn trạng thái phòng', 'Thông báo');
      event.cancel = true;
      return;
    }
    this.roomService.updateRoom(event.oldData.id, updatedData).subscribe(response => {
      if (response.code === 200) {

        this.loadRooms();
      } else {
        // alert('Lỗi: ' + response.name);
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }

  onRowRemoving(event: any) {
    this.roomService.deleteRoom(event.data.id).subscribe(response => {
      if (response.code === 200) {
        this.loadRooms();
      } else {
        // alert('Lỗi: ' + response.name);
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

    if (event.parentType === 'dataRow' && event.dataField === 'categoryId') {
      // Thay editor default bằng DxSelectBox cho chọn categoryId
      event.editorName = 'dxSelectBox';
      event.editorOptions = {
        dataSource: this.room_categories,
        valueExpr: 'id',
        displayExpr: 'name',
        placeholder: 'Chọn hạng phòng'
      };
    }

    if (event.parentType === 'dataRow' && event.dataField === 'statusId') {
      // Thay editor default bằng DxSelectBox cho chọn statusId
      event.editorName = 'dxSelectBox';
      event.editorOptions = {
        dataSource: this.roomStatuses,
        valueExpr: 'id',
        displayExpr: 'name',
        placeholder: 'Chọn trạng thái phòng'
      };
    }
  }

  
}
