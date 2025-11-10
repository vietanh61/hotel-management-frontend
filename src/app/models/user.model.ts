import { Role } from './role.model';
import { Hotel } from './hotel.model';

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  fullName?: string;
  roleId: number;
  hotelId: number;
  email?: string;
  lastLogin?: Date;
  role?: Role;
  hotel?: Hotel;
}