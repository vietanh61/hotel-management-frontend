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
  booking: any = { checkIn: '', checkOut: '', totalPrice: 0, notes: '' };
  customerInfo: any = { fullName: '', email: '', phone: '', address: '', idNumber: '', notes: '' };  // Thông tin khách editable
  details: any[] = [];  // Thêm quantity default 1
  customers: any[] = [];
  searchQuery: string = '';
  showAddCustomer: boolean = false;
  showSearchCustomer: boolean = false;
  newCustomer: any = { fullName: '', email: '', phone: '', address: '', idNumber: '', notes: '' };
  isCustomerChanged: boolean = false;  // Flag nếu thay đổi khách

  isLoading: boolean = false; // <-- Thêm biến loading

  confirmationNo: string = '';
  showConfirmationModal: boolean = false;

  constructor(
    private router: Router,
    private bookingService: BookingService,
    private customerService: CustomerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Lấy dữ liệu từ navigation state (nếu có)
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { selectedRooms: any[], checkIn: string, checkOut: string } | undefined;

    let bookingState = state;

    // Nếu không có state (do reload trang), đọc lại từ localStorage
    if (!bookingState) {
      const storedState = localStorage.getItem('bookingState');
      if (storedState) {
        bookingState = JSON.parse(storedState);
      }
    }

    // Nếu vẫn không có, quay lại trang tìm kiếm
    if (!bookingState || !bookingState.selectedRooms || bookingState.selectedRooms.length === 0) {
      this.toastr.error('Không có dữ liệu phòng được chọn. Vui lòng quay lại tìm kiếm.', 'Lỗi');
      this.router.navigate(['/search']);
      return;
    }

    // Gán thông tin booking
    this.booking.checkIn = bookingState.checkIn;
    this.booking.checkOut = bookingState.checkOut;

    // Map lại danh sách phòng
    this.details = bookingState.selectedRooms.map(room => ({
      roomId: room.roomId,
      roomNumber: room.roomNumber,
      categoryName: room.categoryName,
      pricePerNight: room.pricePerNight,
      quantity: 1,
      subtotal: this.calculateSubtotal(room.pricePerNight, bookingState!.checkIn, bookingState!.checkOut, 1)
    }));

    this.calculateTotal();
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
    this.isLoading = true; // bật trạng thái loading

    let customerId = this.customerInfo.id;  // ID khách hiện tại nếu không thay đổi
    if (this.isCustomerChanged) {  // Nếu thay đổi, tạo khách mới
      this.customerService.createCustomer(this.customerInfo).subscribe(response => {
        if (response.code === 201) {
          customerId = response.data.id;
          this.proceedWithBooking(customerId);
        } else {
          this.toastr.error('Lỗi tạo khách mới', 'Lỗi');
        }
      });
    } else {
      this.proceedWithBooking(customerId);
    }
  }

  proceedWithBooking(customerId: number) {
    this.booking.customerId = customerId;
    const payload = { booking: this.booking, details: this.details };
    this.bookingService.createBookingWithDetails(payload).subscribe({
      next: (response:any)=>{
        this.isLoading = false; // tắt trạng thái loading
        if (response.code === 201) {
          this.toastr.success('Tạo booking thành công', 'Thành công');
          this.confirmationNo = response.data.confirmationNo;  // Lấy từ response backend
          console.info(response.data.confirmationNo);
          setTimeout(() => this.showConfirmationModal = true, 0);// Show modal
          localStorage.removeItem('bookingState'); // Xóa dữ liệu cũ
          //this.router.navigate(['/bookings']);
        } else {
          this.toastr.error(response.name, 'Lỗi');
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        if(err.error.code===400)
        this.toastr.error(err.error.name);
      }
    })
  }
  copyConfirmationNo() {
    navigator.clipboard.writeText(this.confirmationNo).then(() => {
      this.toastr.success('Đã copy ConfirmationNo', 'Thành công');
    }).catch(() => {
      this.toastr.error('Lỗi copy', 'Lỗi');
    });
  }
  closeConfirmationModal() {
    this.showConfirmationModal = false;
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

  onConfirmationPopupShown() {
    console.log('confirmation popup shown, visible=', this.showConfirmationModal);
  }
}