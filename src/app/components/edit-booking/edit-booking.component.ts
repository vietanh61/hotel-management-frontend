import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../../services/booking.service';
import { CustomerService } from '../../services/customer.service';
import { BookingStatusService } from '../../services/booking-status.service';
import { PaymentMethodService } from '../../services/payment-method.service';

@Component({
  selector: 'app-edit-booking',
  templateUrl: './edit-booking.component.html',
  styleUrls: ['./edit-booking.component.scss']
})
export class EditBookingComponent implements OnInit {
  bookingId: number | null = null;
  booking: any = { checkIn: '', checkOut: '', totalPrice: 0, notes: '' };
  customerInfo: any = { fullName: '', email: '', phone: '', address: '', idNumber: '', notes: '' };  // Thông tin khách editable
  details: any[] = [];  // Thêm quantity default 1
  customers: any[] = [];
  searchQuery: string = '';
  showAddCustomer: boolean = false;
  showSearchCustomer: boolean = false;
  newCustomer: any = { fullName: '', email: '', phone: '', address: '', idNumber: '', notes: '' };
  isCustomerChanged: boolean = false;  // Flag nếu thay đổi khách
  isLoading: boolean = false;  // Trạng thái loading
  confirmationNo: string = '';
  bookingStatuses: any[]=[];
  paymentMethods: any[]=[]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private bookingStatusService: BookingStatusService,
    private paymentMethodService: PaymentMethodService
  ) { }

  ngOnInit(): void {
    // Lấy dữ liệu từ navigation state (nếu có)
    const navigation = this.router.getCurrentNavigation();
    this.bookingId = +this.route.snapshot.queryParamMap.get('bookingId')!;
    if (this.bookingId) {
      this.loadBookingDetails(this.bookingId);
    } 
    this.loadPaymentMethods();
    this.loadBookingStatuses();
  }

  calculateSubtotal(pricePerNight: number, checkIn: string, checkOut: string, quantity: number): number {
    const days = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24);
    return pricePerNight * days * quantity;
  }

  calculateSubtotalOnChange(event: any) {
    if (event.column.dataField === 'quantity' && event.row && event.row.data) {
      const rowData = event.row.data;
      const days = (new Date(this.booking.checkOut).getTime() - new Date(this.booking.checkIn).getTime()) / (1000 * 3600 * 24);
      rowData.subtotal = rowData.pricePerNight * days * rowData.quantity;
      this.calculateTotal();
    }
  }

  deleteRow(rowData: any) {
    const index = this.details.indexOf(rowData);
    if (index > -1) {
      this.details.splice(index, 1);
      this.calculateTotal();
      this.toastr.success('Đã xóa dòng phòng', 'Thành công');
    }
  }

  calculateTotal() {
    this.booking.totalPrice = this.details.reduce((sum, detail) => sum + detail.subtotal, 0);
  }

  openSearchCustomerModal() {
    this.showSearchCustomer = true;
  }

  searchCustomers() {
    if (this.searchQuery.trim().length < 3) {
      this.toastr.warning('Vui lòng nhập ít nhất 3 ký tự để tìm kiếm', 'Cảnh báo');
      this.customers = [];
      return;
    }
    this.customerService.searchCustomers(this.searchQuery).subscribe(response => {
      if (response.code === 200) {
        this.customers = response.data;
      } else {
        this.toastr.error(response.name, 'Lỗi');
        this.customers = [];
      }
    });
  }

  selectCustomerFromModal(event: any) {
    const selected = event.itemData;
    this.customerInfo = { ...selected };  // Copy thông tin sang customerInfo editable
    this.showSearchCustomer = false;
    this.isCustomerChanged = false;
  }

  openAddCustomerPopup() {
    this.showAddCustomer = true;
  }

  addNewCustomer() {
    this.customerService.createCustomer(this.newCustomer).subscribe(response => {
      if (response.code === 201) {
        this.toastr.success('Tạo khách thành công', 'Thành công');
        this.customerInfo = { ...response.data };  // Copy sang customerInfo
        this.showAddCustomer = false;
        this.newCustomer = {};
        this.isCustomerChanged = false;
      } else {
        this.toastr.error(response.name, 'Lỗi');
      }
    });
  }

  submitBooking() {
    if (!this.customerInfo.fullName || this.details.length === 0) {
      this.toastr.error('Vui lòng nhập thông tin khách và chọn phòng', 'Lỗi');
      return;
    }
    this.isLoading = true;  // Bật loading

    let customerId = this.customerInfo.id;  // ID khách hiện tại nếu không thay đổi
    let bookingId = this.bookingId;
    if (this.isCustomerChanged) {  // Nếu thay đổi, tạo khách mới
      this.customerService.createCustomer(this.customerInfo).subscribe(response => {
        if (response.code === 201) {
          customerId = response.data.id;
          this.proceedWithBooking(customerId, bookingId);
        } else {
          this.toastr.success('Lỗi tạo khách mới', 'Lỗi');
          this.isLoading = false;
        }
      });
    } else {
      this.proceedWithBooking(customerId, bookingId);
    }
  }

  proceedWithBooking(customerId: number, bookingId: number|null) {
    this.booking.customerId = customerId;
    this.booking.id = bookingId;
    const payload = { booking: this.booking, details: this.details };
    this.bookingService.editBookingWithDetails(payload).subscribe(response => {
      this.isLoading = false;  // Tắt loading
      if (response.code === 201) {
        this.toastr.success('Cập nhật booking thành công', 'Thành công');
      } else {
        this.toastr.error(response.name, 'Lỗi');
      }
    });
  }


  closeConfirmationModal() {
    this.router.navigate(['/bookings']);
  }

  onRowUpdated(e: any) {
    const updatedItem = e.data;

    // Tìm lại dòng trong mảng `details` và tính lại tiểu tổng
    const index = this.details.findIndex(d => d.roomNumber === updatedItem.roomNumber);
    if (index !== -1) {
      this.details[index].subtotal = this.details[index].pricePerNight * this.details[index].quantity;
    }

    // Sau đó tính lại tổng tiền booking
    this.booking.totalPrice = this.details.reduce((sum, d) => sum + d.subtotal, 0);
  }

  loadBookingDetails(id: number) {
    this.bookingService.getBooking(id).subscribe(response => {

      if (response.code === 404) {
        this.toastr.error("Không tim thấy booking nào", 'Lỗi');
        return;
      }
      if (response.code === 200) {
        this.booking = response.data;
        this.customerInfo = response.data.customer;
        this.details = response.data.bookingDetails.map((detail: any) => ({
          roomId :  detail.roomId,
          roomNumber: detail.room.roomNumber,
          categoryName: detail.room.category.name,
          pricePerNight: detail.pricePerNight,
          quantity: 1,  // Giả định, adjust nếu có quantity
          subtotal: detail.subtotal
        }));
        this.calculateTotal();
      } 
      else {
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
}