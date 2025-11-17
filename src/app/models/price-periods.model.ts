export interface PricePeriod {
  id: number;
  hotelId: number;
  categoryId: number;
  startDate: Date;
  endDate: number;
  pricePerNight: number;
}