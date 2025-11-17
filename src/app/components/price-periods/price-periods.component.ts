import { Component, OnInit } from '@angular/core';
import { PricePeriodService } from '../../services/price-period.service';
import { ToastrService } from 'ngx-toastr';  // Import Toastr
import { HotelService } from '../../services/hotel.service';
import { RoomCategoryService } from '../../services/room-category.service';
import NumberBox from "devextreme/ui/number_box";

@Component({
  selector: 'app-price-periods',
  templateUrl: './price-periods.component.html',
  styleUrls: ['./price-periods.component.scss']
})

export class PricePeriodsComponent implements OnInit {
  pricePeriods: any[] = [];  // Lưu data từ ApiResponse của HotelManagementApi
  hotels: any[] = [];  // Lưu data từ ApiResponse của HotelManagementApi
  room_categories: any[] = [];
  constructor(
    private pricePeriodService: PricePeriodService,
    private toastr: ToastrService,
    private hotelService: HotelService,
    private roomCategoryService: RoomCategoryService
  ){ }

  ngOnInit(): void {
    this.loadPricePeriods();
    this.loadHotels();
    this.loadRoomCategories();
  }

  loadPricePeriods() {
    this.pricePeriodService.getPricePeriods().subscribe(response => {
      if (response.code === 200) {
        this.pricePeriods = response.data;
      } else {
        //alert(response.name);  // Xử lý lỗi
        this.toastr.error(response.name, 'Thông báo');
      }
    });
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
  loadRoomCategories() {
    this.roomCategoryService.getRoomCategories().subscribe(response => {
      if (response.code === 200) {
        this.room_categories = response.data;
      } else {
        alert(response.name);
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
    this.pricePeriodService.createPricePeriod(event.data).subscribe(response => {
      if (response.code === 201) {
        this.loadPricePeriods();  // Reload
      } else {
        //alert('Lỗi: ' + response.name);
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }

  onRowUpdating(event: any) {
    const updatedData = { ...event.oldData, ...event.newData };
    if (!event.data.hotelId) {
      //alert('Vui lòng chọn khách sạn');
      this.toastr.error('Vui lòng chọn khách sạn', 'Thông báo');
      event.cancel = true;
      return;
    }
    this.pricePeriodService.updatePricePeriod(event.oldData.id, updatedData).subscribe(response => {
      if (response.code === 200) {
        this.loadPricePeriods();
      } else {
        //alert('Lỗi: ' + response.name);
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }

  onRowRemoving(event: any) {
    this.pricePeriodService.deletePricePeriod(event.data.id).subscribe(response => {
      if (response.code === 200) {
        this.loadPricePeriods();
      } else {
        //alert('Lỗi: ' + response.name);
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }
  priceEditor = (cellElement: any, cellInfo: any) => {
      const div = document.createElement("div");
      cellElement.append(div);

      // Tạo số dạng DevExtreme NumberBox
      const numberBox = new NumberBox(div, {
          value: cellInfo.value,
          showSpinButtons: true,
          format: "#,##0",
          onValueChanged: (e: any) => {
              cellInfo.setValue(e.value);
          }
      });
  };

}