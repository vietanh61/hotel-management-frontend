import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HotelsComponent } from './components/hotels/hotels.component';  // Thêm dòng này
import { DxDataGridModule, DxButtonModule, DxPopupModule, DxTemplateModule } from 'devextreme-angular';  // DevExtreme modules
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
import { SearchComponent } from './components/search/search.component';  // Import here

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
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,  // Thêm vào đây
    DxDataGridModule,
    DxButtonModule,
    DxPopupModule,
    DxTemplateModule,
    FormsModule,
    BrowserAnimationsModule,  // Add this for toastr animations
    ToastrModule.forRoot({    // Configure globally
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
