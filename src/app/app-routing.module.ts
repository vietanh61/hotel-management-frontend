import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelsComponent } from './components/hotels/hotels.component';
import { RolesComponent } from './components/roles/roles.component';
import { UsersComponent } from './components/users/users.component';
import { RoomCategoriesComponent } from './components/room-categories/room-categories.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { LoginComponent } from './components/login/login.component';
import { SearchComponent } from './components/search/search.component';



const routes: Routes = [
  {
    path: '',
    children: 
  [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'hotels', component: HotelsComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'users', component: UsersComponent },
      { path: 'room-categories', component: RoomCategoriesComponent },
      { path: 'rooms', component: RoomsComponent },
      { path: 'search', component: SearchComponent },
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
