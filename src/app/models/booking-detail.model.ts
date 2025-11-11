// Frontend: src/app/models/booking-detail.model.ts (nếu chưa có)
export interface BookingDetail {
  id: number;
  bookingId: number;
  roomId: number;
  pricePerNight: number;
  subtotal: number;
}