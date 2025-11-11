import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../../services/booking.service';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss']
})
export class CreateBookingComponent implements OnInit {
  booking: any = { checkIn: '', checkOut: '', totalPrice: 0, notes: '' };  // Khởi tạo booking
  details: any[] = [];  // BookingDetails từ selectedRooms
  customers: any[] = [];
  selectedCustomer: any = null;
  searchQuery: string = '';
  showAddCustomer: boolean = false;
  newCustomer: any = { fullName: '', email: '', phone: '', address: '', idNumber: '', notes: '' };

  constructor(
    private router: Router,
    private bookingService: BookingService,
    private customerService: CustomerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { selectedRooms: any[], checkIn: string, checkOut: string };
    if (state) {
      this.booking.checkIn = state.checkIn;
      this.booking.checkOut = state.checkOut;
      this.details = state.selectedRooms.map(room => ({
        roomId: room.id,
        pricePerNight: room.pricePerNight,
        subtotal: this.calculateSubtotal(room.pricePerNight, state.checkIn, state.checkOut)
      }));
      this.calculateTotal();
    }
  }

  calculateSubtotal(pricePerNight: number, checkIn: string, checkOut: string): number {
    const days = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24);
    return pricePerNight * days;
  }

  calculateTotal() {
    this.booking.totalPrice = this.details.reduce((sum, detail) => sum + detail.subtotal, 0);
  }

  searchCustomers() {
    if (this.searchQuery.length >= 3) {  // Để tránh query quá ngắn
      this.customerService.searchCustomers(this.searchQuery).subscribe(response => {
        if (response.code === 200) {
          this.customers = response.data;
        } else {
          this.toastr.error(response.name, 'Thông báo');
        }
      });
    } else {
      this.customers = [];
    }
  }

  selectCustomer(event: any) {
    this.selectedCustomer = event.itemData;
    this.booking.customerId = this.selectedCustomer.id;
    this.customers = [];  // Ẩn list sau khi chọn
  }

  openAddCustomerPopup() {
    this.showAddCustomer = true;
  }

  addNewCustomer() {
    this.customerService.createCustomer(this.newCustomer).subscribe(response => {
      if (response.code === 201) {
        this.toastr.success('Tạo khách thành công', 'Thành công');
        this.selectedCustomer = response.data;
        this.booking.customerId = this.selectedCustomer.id;
        this.showAddCustomer = false;
        this.newCustomer = {};  // Reset form
      } else {
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }

  submitBooking() {
    if (!this.booking.customerId || this.details.length === 0) {
      this.toastr.error('Vui lòng chọn khách hàng và phòng', 'Thông báo');
      return;
    }
    this.bookingService.createBookingWithDetails(this.booking, this.details).subscribe(response => {
      if (response.code === 201) {
        this.toastr.success('Tạo booking thành công', 'Thành công');
        this.router.navigate(['/bookings']);
      } else {
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }
}