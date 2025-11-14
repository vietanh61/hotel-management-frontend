// src/app/components/bookings/bookings.component.ts
import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { BookingStatusService } from '../../services/booking-status.service';
import { PaymentMethodService } from '../../services/payment-method.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {
  bookings: any[] = [];
  bookingDetails: any[] = [];
  bookingStatuses: any[] = [];
  paymentMethods: any[] = [];
  showDetailModal: boolean = false;
  selectedBooking: any = null;

  constructor(
    private bookingService: BookingService,
    private bookingStatusService: BookingStatusService,
    private paymentMethodService: PaymentMethodService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadBookings();
    this.loadBookingStatuses();
    this.loadPaymentMethods();
  }

  loadBookings() {
    this.bookingService.getBookings().subscribe(response => {
      if (response.code === 200) {
        this.bookings = response.data;
      } else {
        this.toastr.error(response.name, 'Lỗi');
      }
    });
  }

  loadBookingStatuses() {
    this.bookingStatusService.getBookingStatuses().subscribe(response => {
      if (response.code === 200) {
        this.bookingStatuses = response.data;
      } else {
        this.toastr.error(response.name, 'Lỗi');
      }
    });
  }

  loadPaymentMethods() {
    this.paymentMethodService.getPaymentMethods().subscribe(response => {
      if (response.code === 200) {
        this.paymentMethods = response.data;
      } else {
        this.toastr.error(response.name, 'Lỗi');
      }
    });
  }

  openDetailModal(booking: any) {
    this.selectedBooking = { ...booking };  // Copy để edit
    this.showDetailModal = true;
  }

  // updateBooking(booking: any) {
  //   this.bookingService.updateBooking(booking.id, booking).subscribe(response => {
  //     if (response.code === 200) {
  //       this.toastr.success('Cập nhật thành công', 'Thành công');
  //       this.loadBookings();
  //     } else {
  //       this.toastr.error(response.name, 'Lỗi');
  //     }
  //   });
  // }
}