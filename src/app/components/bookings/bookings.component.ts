// src/app/components/bookings/bookings.component.ts
import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { BookingStatusService } from '../../services/booking-status.service';
import { PaymentMethodService } from '../../services/payment-method.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from 'src/app/services/hotel.service';

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
  hotels: any[] = [];  // Danh sách khách sạn cho dropdown

  readonly allowedPageSizes = [5, 10, 'all'];
  readonly displayModes = [{ text: "Display Mode 'full'", value: 'full' }, { text: "Display Mode 'compact'", value: 'compact' }];
  displayMode = 'full';

  showPageSizeSelector = true;

  showInfo = true;

  showNavButtons = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private bookingStatusService: BookingStatusService,
    private paymentMethodService: PaymentMethodService,
    private toastr: ToastrService,
    private hotelService: HotelService,

  ) { }

  ngOnInit(): void {
    this.loadBookings();
    this.loadBookingStatuses();
    this.loadPaymentMethods();
    this.loadHotel();  // Load hotels cho dropdown

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
  openDetail(booking: any) {
    this.router.navigate(['/edit-booking'], { queryParams: { bookingId: booking.id } });
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
  onCellPrepared(e: any) {
    if (e.rowType === 'data' && e.column.dataField === 'status.name') {
        const status = e.data.status?.name;

        if (status === 'Canceled' || status === 'Cancelled') {
            e.cellElement.style.backgroundColor = '#ffcccc';
            e.cellElement.style.color = 'red';
            e.cellElement.style.fontWeight = 'bold';
        }
    }
  }
}