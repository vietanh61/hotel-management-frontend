import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { HotelService } from 'src/app/services/hotel.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})

export class CustomersComponent implements OnInit {
  customers: any[] = [];

  readonly allowedPageSizes = [5, 10, 'all'];
  readonly displayModes = [{ text: "Display Mode 'full'", value: 'full' }, { text: "Display Mode 'compact'", value: 'compact' }];
  displayMode = 'full';
  showPageSizeSelector = true;
  showInfo = true;
  showNavButtons = true;
  hotels: any[] = [];  // Danh sách khách sạn cho dropdown

  constructor(
    private toastr: ToastrService,
    private customerService: CustomerService,
    private hotelService: HotelService,

  ) { }

  ngOnInit(): void {
    this.loadCustomers();
    this.loadHotel();  // Load hotels cho dropdown

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
  loadCustomers() {
    this.customerService.getCustomers().subscribe(response => {
      if (response.code === 200) {
        this.customers = response.data;
      } else {
        this.toastr.error(response.name, 'Lỗi');
      }
    });
  }

  onRowInserted(event: any) {
    this.customerService.createCustomer(event.data).subscribe(response => {
      if (response.code === 201) {
        this.loadCustomers();  // Reload
      } else {
        alert('Lỗi: ' + response.name);
      }
    });
  }

  onRowUpdating(event: any) {
    const updatedData = { ...event.oldData, ...event.newData };
    this.customerService.updateCustomer(event.oldData.id, updatedData).subscribe(response => {
      if (response.code === 200) {
        this.loadCustomers();
      } else {
        alert('Lỗi: ' + response.name);
      }
    });
  }

  onRowRemoving(event: any) {
    this.customerService.deleteCustomer(event.data.id).subscribe(response => {
      if (response.code === 200) {
        this.loadCustomers();
      } else {
        alert('Lỗi: ' + response.name);
      }
    });
  }
}