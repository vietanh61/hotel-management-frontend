export interface RoomCategory {
  id: number;
  hotelId: number;
  name: string;
  description?: string;
  capacity: number;
  amenities?: string;
  hotel?: { name: string };  // Navigation property đơn giản cho display
}