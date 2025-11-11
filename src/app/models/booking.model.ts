// Frontend: src/app/models/booking.model.ts (nếu chưa có)
export interface Booking {
  id: number;
  hotelId: number;
  customerId: number;
  bookingDate: Date;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  statusId: number;
  paymentMethodId?: number;
  notes?: string;
}