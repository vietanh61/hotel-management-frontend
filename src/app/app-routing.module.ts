import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelsComponent } from './components/hotels/hotels.component';
import { RolesComponent } from './components/roles/roles.component';
import { UsersComponent } from './components/users/users.component';
import { RoomCategoriesComponent } from './components/room-categories/room-categories.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { LoginComponent } from './components/login/login.component';
import { SearchComponent } from './components/search/search.component';
import { CreateBookingComponent } from './components/create-booking/create-booking.component';
import { AuthGuard } from './guards/auth.guard';  // Import guard
import { BookingsComponent } from './components/bookings/bookings.component';
import { EditBookingComponent } from './components/edit-booking/edit-booking.component';
import { PricePeriodsComponent } from './components/price-periods/price-periods.component';
import { ExtrasComponent } from './components/extras/extras.component';
import { CustomersComponent } from './components/customers/customers.component';


const routes: Routes = [
  {
    path: '',
    children: 
  [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'hotels', component: HotelsComponent,canActivate: [AuthGuard] },
      { path: 'roles', component: RolesComponent,canActivate: [AuthGuard] },
      { path: 'users', component: UsersComponent,canActivate: [AuthGuard] },
      { path: 'room-categories', component: RoomCategoriesComponent,canActivate: [AuthGuard] },
      { path: 'rooms', component: RoomsComponent,canActivate: [AuthGuard] },
      { path: 'search', component: SearchComponent,canActivate: [AuthGuard] },
      { path: 'create-booking', component: CreateBookingComponent,canActivate: [AuthGuard] },
      { path: 'bookings', component: BookingsComponent,canActivate: [AuthGuard] },
      { path: 'edit-booking', component: EditBookingComponent,canActivate: [AuthGuard] },
      { path: 'price-periods', component: PricePeriodsComponent,canActivate: [AuthGuard] },
      { path: 'extras', component: ExtrasComponent,canActivate: [AuthGuard] },
      { path: 'customers', component: CustomersComponent,canActivate: [AuthGuard] },
  ] 
  },
  {
    path: '',
    children: [
      { path: 'login', component: LoginComponent },
      // có thể thêm: forgot-password, register...
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
