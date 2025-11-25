import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';  // Import Toastr

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  username: string = '';  // Declare as class property
  password: string = '';  // Declare as class property
  rememberMe: boolean = false;  // Để xử lý checkbox nếu cần (lưu token lâu hơn)
  constructor(
    private authService: AuthService, 
    private router: Router,
    private toastr: ToastrService  // Inject Toastr
  ) { }

  login() {
    if (!this.username || !this.password) {
      //alert('Vui lòng nhập tên đăng nhập và mật khẩu');
      this.toastr.error('Vui lòng nhập tên đăng nhập và mật khẩu','Thông báo');
      return;
    }
    this.authService.login(this.username, this.password).subscribe(response => {
      this.authService.saveToken(response.data.token);
      this.authService.setCurrentUser(response.data.user);  // ← Lưu user
      this.toastr.success('Đăng nhập thành công','Thông báo');
      this.router.navigate(['/']);
    }, error => {
      //alert('Thông báo đăng nhập');
      this.toastr.error('Đã xảy ra lỗi','Thông báo');
      
    });
  }

  ngOnInit(): void {
    document.body.className = 'hold-transition login-page';
  }

  ngOnDestroy(): void {
    document.body.className = 'hold-transition sidebar-mini layout-fixed';
  }

}
