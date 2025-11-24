import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HotelsComponent } from './components/hotels/hotels.component';  // Thêm dòng này
import { FormsModule } from '@angular/forms';
import { RolesComponent } from './components/roles/roles.component';
import { UsersComponent } from './components/users/users.component';
import { RoomCategoriesComponent } from './components/room-categories/room-categories.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';  // Cho form
import { FooterComponent } from './layouts/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { RoomsComponent } from './components/rooms/rooms.component';  
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // Required for animations
import { ToastrModule } from 'ngx-toastr';
import { SearchComponent } from './components/search/search.component';
import { CreateBookingComponent } from './components/create-booking/create-booking.component';  // Import here
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';  // Add this import (adjust path if needed)
import { BookingsComponent } from './components/bookings/bookings.component';
import { EditBookingComponent } from './components/edit-booking/edit-booking.component';
import { PricePeriodsComponent } from './components/price-periods/price-periods.component';
import { ExtrasComponent } from './components/extras/extras.component';
import { DevExtremeModule } from './devextreme.module'; // đường dẫn chỉnh cho đúng
import { DxTemplateModule } from 'devextreme-angular';
import { CustomersComponent } from './components/customers/customers.component';
import { UserRolesComponent } from './components/user-roles/user-roles.component';

@NgModule({
  declarations: [
    AppComponent,
    HotelsComponent,
    RolesComponent,
    UsersComponent,
    RoomCategoriesComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    LoginComponent,
    RoomsComponent,
    SearchComponent,
    CreateBookingComponent,
    BookingsComponent,
    EditBookingComponent,
    PricePeriodsComponent,
    ExtrasComponent,
    CustomersComponent,
    UserRolesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,  // Thêm vào đây
    DevExtremeModule,
    FormsModule,
    BrowserAnimationsModule,  // Add this for toastr animations
    DxTemplateModule, 
    ToastrModule.forRoot({    // Configure globally
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
