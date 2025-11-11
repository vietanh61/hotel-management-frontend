import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HotelsComponent } from './components/hotels/hotels.component';  // Thêm dòng này
import { DxDataGridModule, DxButtonModule, DxPopupModule, DxTemplateModule, DxListModule, DxFormModule } from 'devextreme-angular';  // DevExtreme modules
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
    CreateBookingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,  // Thêm vào đây
    DxDataGridModule,
    DxButtonModule,
    DxPopupModule,
    DxTemplateModule,
    DxListModule,
    DxFormModule,
    FormsModule,
    BrowserAnimationsModule,  // Add this for toastr animations
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
