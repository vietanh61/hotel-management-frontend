import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../../services/booking.service';
import { CustomerService } from '../../services/customer.service';
import { ExtraService } from '../../services/extra.service';  // Thêm ExtraService
import { BookingStatusService } from '../../services/booking-status.service';
import { PaymentMethodService } from '../../services/payment-method.service';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss']
})
export class CreateBookingComponent implements OnInit {
  booking: any = { checkIn: '', checkOut: '', totalPrice: 0, notes: '' };
  customerInfo: any = { fullName: '', email: '', phone: '', address: '', idNumber: '', notes: '' };  // Thông tin khách editable
  details: any[] = [];  // Thêm quantity default 1
  extras: any[] = [];  // List extras
  allExtras: any[] = [];  // Danh sách extras load từ API
  customers: any[] = [];
  searchQuery: string = '';
  showAddCustomer: boolean = false;
  showSearchCustomer: boolean = false;
  newCustomer: any = { fullName: '', email: '', phone: '', address: '', idNumber: '', notes: '' };
  isCustomerChanged: boolean = false;  // Flag nếu thay đổi khách
  isLoading: boolean = false;  // Trạng thái loading
  confirmationNo: string = '';
  showConfirmationModal: boolean = false;
  bookingStatuses: any[]=[];
  paymentMethods: any[]=[];
  currentEditingRow: any = null;   // <-- THÊM DÒNG NÀY

  constructor(
    private router: Router,
    private bookingService: BookingService,
    private customerService: CustomerService,
    private extraService: ExtraService,
    private toastr: ToastrService,
    private bookingStatusService: BookingStatusService,
    private paymentMethodService: PaymentMethodService,
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
    this.loadPaymentMethods();
    this.loadBookingStatuses();
    //this.loadBookingStatus();
    this.loadExtras();  // Load extras từ API
    this.calculateTotal();
  }

  loadExtras() {
    this.extraService.getExtras().subscribe(response => {
      if (response.code === 200) {
        this.allExtras = response.data;
      } else {
        this.toastr.error(response.name, 'Lỗi');
      }
    });
  }

  /** Khi bắt đầu edit một dòng extra */
  onEditingStart(e: any) {
    console.log('Bắt đầu edit dòng:', e.data);
    
    this.currentEditingRow = e.data;   // lưu lại dòng đang được edit
  }

  calculateSubtotal(pricePerNight: number, checkIn: string, checkOut: string, quantity: number): number {
    const days = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24);
    return pricePerNight * days * quantity;
  }

  calculateTotal() {
    const detailsTotal = this.details.reduce((sum, detail) => sum + detail.subtotal, 0);
    const extrasTotal = this.extras.reduce((sum, extra) => sum + extra.subtotal, 0);
    this.booking.totalPrice = detailsTotal + extrasTotal;
  }

  onDetailRowUpdated(e: any) {
    const updatedItem = e.data;

    // Tìm lại dòng trong mảng `details` và tính lại tiểu tổng
    const index = this.details.findIndex(d => d.roomNumber === updatedItem.roomNumber);
    if (index !== -1) {
      this.details[index].subtotal = this.calculateSubtotal(this.details[index].pricePerNight, this.booking.checkIn, this.booking.checkOut, this.details[index].quantity);
    }
    this.calculateTotal();
  }
  /** Tính số đêm ở */
  private getNumberOfNights(): number {
    if (!this.booking.checkIn || !this.booking.checkOut) return 1;
    const checkIn  = new Date(this.booking.checkIn);
    const checkOut = new Date(this.booking.checkOut);
    const diffMs   = checkOut.getTime() - checkIn.getTime();
    return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }
  onExtraRowUpdated(e: any) {
    const updatedItem = e.data;

    // Tìm lại dòng trong mảng `extras` và tính lại tiểu tổng
    const index = this.extras.findIndex(ex => ex.extraId === updatedItem.extraId);
    if (index !== -1) {
      this.extras[index].subtotal = this.calculateExtraSubtotal(this.extras[index]);
    }
    this.calculateTotal();
  }

  addExtra() {
    this.extras.push({ extraId: null, quantity: 1, priceAtBooking: 0, subtotal: 0, unit: '' });
  }

  deleteExtra(rowData: any) {
    const index = this.extras.indexOf(rowData);
    if (index > -1) {
      this.extras.splice(index, 1);
      this.calculateTotal();
      this.toastr.success('Đã xóa phụ thu', 'Thành công');
    }
  }

  /** Khi người dùng chọn một Extra trong dx-lookup */
  onExtraSelectionChanged(e: any) {
    console.log('onExtraSelectionChanged được gọi');
    console.log('e.value (id được chọn):', e.value);
    console.log('currentEditingRow hiện tại:', this.currentEditingRow);
    console.log('allExtras:', this.allExtras);

    if (!e.value) {
      console.log('Không có giá trị chọn');
      return;
    }
    if (!e.value || !this.currentEditingRow) return;

    if (!this.currentEditingRow) {
      console.warn('currentEditingRow là null! Không biết đang edit dòng nào');
      return;
    }
    const selectedExtra = this.allExtras.find(ex => ex.id === e.value);
    console.log('Extra tìm được:', selectedExtra);
    if (!selectedExtra) return;

    // Cập nhật dữ liệu của dòng đang edit
    this.currentEditingRow.extraId       = selectedExtra.id;
    this.currentEditingRow.priceAtBooking = selectedExtra.price;
    this.currentEditingRow.unit          = selectedExtra.unit.name;   // hoặc selectedExtra.unitId

    // Tính lại tiểu tổng ngay lập tức
    this.currentEditingRow.subtotal = this.calculateExtraSubtotal(this.currentEditingRow);

    // Cập nhật lại tổng tiền
    this.calculateTotal();
  }
  // Khi chuẩn bị mở editor (click vào ô)
  onEditorPreparing(e: any) {
    if (e.parentType === 'dataRow' && e.editorName === 'dxSelectBox') {
      // Lưu lại dòng đang edit
      this.currentEditingRow = e.row.data;

      // Gắn sự kiện value changed để bắt sự kiện chọn
      e.editorOptions.onValueChanged = (args: any) => {
        this.onExtraSelectionChanged(args);
      };
    }
  }
  setQuantity(rowData: any, value: number) {
    rowData.quantity = value;
    rowData.subtotal = this.calculateExtraSubtotal(rowData);
    this.calculateTotal();
  }
  /** Tính tiểu tổng của một dòng extra */
  calculateExtraSubtotal(extra: any): number {
    const nights = this.getNumberOfNights();

    // Các kiểu tính tiền theo unit (có thể mở rộng thêm)
    switch (extra.unit) {
      case 'Cố định':           // fixed
        return extra.priceAtBooking * extra.quantity;
      case 'fixed':
        return extra.priceAtBooking * extra.quantity;

      case '1 người':      
        return extra.priceAtBooking * extra.quantity;     // per_person
      case 'per_person':
        return extra.priceAtBooking * extra.quantity;

      case 'per_night':
        return extra.priceAtBooking * nights * extra.quantity;

      case 'per_stay':
        return extra.priceAtBooking * extra.quantity;

      default:
        return extra.priceAtBooking * extra.quantity;
    }
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
    const payload = { 
      booking: 
      {
        ... this.booking,
        checkIn: this.booking.checkIn,   // đã là yyyy-MM-dd
        checkOut: this.booking.checkOut  // đã là yyyy-MM-dd
      }, 
      details: this.details, 
      extras: this.extras };
    this.bookingService.createBookingWithDetails(payload).subscribe({
      next: (response: any) => {
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
        if (err.error.code === 400)
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

  onConfirmationPopupShown() {
    console.log('confirmation popup shown, visible=', this.showConfirmationModal);
  }

  deleteRow(rowData: any) {
    const index = this.details.indexOf(rowData);
    if (index > -1) {
      this.details.splice(index, 1);
      this.calculateTotal();
      this.toastr.success('Đã xóa dòng phòng', 'Thành công');
    }
  }

  calculateSubtotalOnChange(event: any) {
    if (event.column.dataField === 'quantity' && event.row && event.row.data) {
      const rowData = event.row.data;
      const days = (new Date(this.booking.checkOut).getTime() - new Date(this.booking.checkIn).getTime()) / (1000 * 3600 * 24);
      rowData.subtotal = rowData.pricePerNight * days * rowData.quantity;
      this.calculateTotal();
    }
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

  loadBookingStatuses() {
    this.bookingStatusService.getBookingStatuses().subscribe(response => {
      if (response.code === 200) {
        this.bookingStatuses = response.data;
      } else {
        this.toastr.error(response.name, 'Lỗi');
      }
    });
  }
  loadBookingStatus() {
    this.bookingStatusService.getBookingStatus(1).subscribe(response => {
      if (response.code === 200) {
        this.bookingStatuses = response.data;
      } else {
        this.toastr.error(response.name, 'Lỗi');
      }
    });
  }
}
