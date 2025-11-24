import { Role } from './role.model';
import { Hotel } from './hotel.model';

export interface UserRole {
  roleId: number;
  roleName?: string;
}

export interface User {
  id: number;
  username: string;
  passwordHash?: string;
  fullName?: string;
  roleId?: number;
  hotelId?: number;
  email?: string;
  lastLogin?: Date;
  role?: Role;
  hotel?: Hotel;

  // Các trường dùng phía client (optional)
  userRoles?: UserRole[];   // nếu backend trả danh sách userRoles
  roles?: number[];         // mảng roleId rút gọn để bind checkbox/select
}

export interface ApiResponse<T> {
  code: number;
  name: string;
  data: T;
}