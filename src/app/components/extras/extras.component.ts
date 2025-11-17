import { Component, OnInit } from '@angular/core';
import { ExtraService } from '../../services/extra.service';
import { ExtraUnitService } from 'src/app/services/extra-unit.service';
import { ToastrService } from 'ngx-toastr';  // Import Toastr
import { HotelService } from 'src/app/services/hotel.service';
import NumberBox from "devextreme/ui/number_box";

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.scss']
})

export class ExtrasComponent {
  extras: any[] = [];
  extra_units: any[] = [];  // Danh sách khách sạn cho dropdown
  hotels: any[] = [];  // Danh sách khách sạn cho dropdown

  constructor(
    private extraService: ExtraService,
    private extraUnitService: ExtraUnitService,
    private hotelService: HotelService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadExtras();
    this.loadExtraUnits();  // Load units cho dropdown
    this.loadHotel();  // Load hotels cho dropdown
  }

  loadExtras() {
    this.extraService.getExtras().subscribe(response => {
      if (response.code === 200) {
        this.extras = response.data;
      } else {
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }
  loadExtraUnits() {
    this.extraUnitService.getExtraUnits().subscribe(response => {
      if (response.code === 200) {
        this.extra_units = response.data;
      } else {
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }
  loadHotel() {
    this.hotelService.getHotels().subscribe(response => {
      if (response.code === 200) {
        this.hotels = response.data;
      } else {
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }
  onInitNewRow(event: any) {
    event.data.hotelId = this.hotels.length > 0 ? this.hotels[0].id : null;  // Default to first hotel if available
  }
  onRowInserted(event: any) {
    if (!event.data.hotelId) {
      this.toastr.error('Vui lòng chọn khách sạn', 'Thông báo');
      event.cancel = true;
      return;
    }
    this.extraService.createExtra(event.data).subscribe(response => {
      if (response.code === 201) {
        this.loadExtras();
      } else {
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
    this.extraService.updateExtra(event.oldData.id, updatedData).subscribe(response => {
      if (response.code === 200) {
        this.loadExtras();
      } else {
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }

  onRowRemoving(event: any) {
    this.extraService.deleteExtra(event.data.id).subscribe(response => {
      if (response.code === 200) {
        this.loadExtras();
      } else {
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }

  onEditorPreparing(event: any) {
    if (event.parentType === 'dataRow' && event.dataField === 'unitId') {
      // Thay editor default bằng DxSelectBox cho chọn hotelId
      event.editorName = 'dxSelectBox';
      event.editorOptions = {
        dataSource: this.extra_units,
        valueExpr: 'id',
        displayExpr: 'name',
        placeholder: 'Chọn đơn vị tính'
      };
    }
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
