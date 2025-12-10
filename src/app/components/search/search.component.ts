import { Component } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';  // Import Toastr

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent {
  bookingId: number | null = null;  // Biến để nhận BookingId từ URL
  //checkIn: string = new Date().toISOString().split('T')[0];  // Default hôm nay
  //checkOut: string = new Date(Date.now() + 86400000).toISOString().split('T')[0];  // Default mai
  rooms: any[] = [];
  selectedRooms: any[] = [];
  checkIn: string | number | Date = new Date();                    // hôm nay
  checkOut: string | number | Date = new Date(Date.now() + 86400000); // ngày mai
  constructor(
    private searchService: SearchService, 
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    // Lấy BookingId từ query param trên URL (e.g., /search?bookingId=123)
    this.bookingId = +this.route.snapshot.queryParamMap.get('bookingId')! || null;
    console.log('BookingId từ URL:', this.bookingId);  // Debug
  }
  search() {
    if (!this.checkIn || !this.checkOut || new Date(this.checkIn) >= new Date(this.checkOut)) {
      //alert('Vui lòng chọn ngày hợp lệ');
      this.toastr.error('Vui lòng chọn ngày hợp lệ', 'Thông báo');
      return;
    }
    const checkInStr = this.formatDate(this.checkIn);
    const checkOutStr = this.formatDate(this.checkOut);
    this.searchService.searchAvailableRooms(checkInStr, checkOutStr).subscribe(response => {
      if (response.code === 200) {
        this.rooms = response.data;
        if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
          this.toastr.warning("Hiện tại không còn phòng nào trống trong thời gian này.\nVui lòng chọn khoảng ngày khác.", 'Thông báo');  
          return;
        }
      } else {
        //alert(response.name);
        this.toastr.error(response.name, 'Thông báo');
      }
    });
  }
  private formatDate(d: any): string {
    if (!d) throw new Error("Invalid date");

    // yyyy-MM-dd
    if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d;

    // dd/MM/yyyy → yyyy-MM-dd
    if (typeof d === 'string' && d.includes('/')) {
      const [day, month, year] = d.split('/');
      return `${year}-${month}-${day}`;
    }

    const date = new Date(d);
    return date.toISOString().split('T')[0];
  }
  onSelectionChanged(event: any) {
    this.selectedRooms = event.selectedRowsData;
  }

  proceedToBooking() {
    if (this.selectedRooms.length === 0) {
      this.toastr.warning('Vui lòng chọn ít nhất một phòng', 'Cảnh báo');
      return;
    }
    const checkInStr = this.formatDate(this.checkIn);
    const checkOutStr = this.formatDate(this.checkOut);
    const state = {
      selectedRooms: this.selectedRooms.map(room => ({
        roomId: room.roomId,
        roomNumber: room.roomNumber,
        categoryName: room.categoryName,
        pricePerNight: room.pricePerNight,
        subtotal: 0,
        quantity: room.quantity
      })),
      checkIn: checkInStr,
      checkOut: checkOutStr
    };
    // Lưu vào localStorage để persist qua reload
    localStorage.setItem('bookingState', JSON.stringify(state));
    // Nếu có BookingId, chuyển sang edit-booking với query param và state thêm phòng
    if (this.bookingId) {
      this.router.navigate(['/edit-booking'], { queryParams: { bookingId: this.bookingId }, state });
    } else {
      this.router.navigate(['/create-booking'], { state });
    }
  }

}