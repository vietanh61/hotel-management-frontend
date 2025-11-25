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
  userRoles?: UserRole[];
  hotel?: Hotel;

  // Các trường dùng phía client (optional)
  roleIds?: number[];     // Để binding popup
  roleNames?: string[];   // Để hiển thị ở grid
}

export interface ApiResponse<T> {
  code: number;
  name: string;
  data: T;
}

// models/current-user.model.ts
export interface CurrentUser {
  id: number;
  username: string;
  fullName: string;
  email?: string;
  hotelId: number;
  hotelName: string;
  roles: string[];
}