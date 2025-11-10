export interface Room {
  id: number;
  hotelId: number;
  roomNumber: string;
  categoryId: number;
  statusId: number;
  hotel?: { name: string };  // Navigation property đơn giản cho display
  category?: { name: string };  // Navigation property đơn giản cho display
  roomStatus?: { name: string };  // Navigation property đơn giản cho display
}