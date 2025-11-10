import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    document.body.className = 'hold-transition login-page';
  }

  ngOnDestroy(): void {
    document.body.className = 'hold-transition sidebar-mini layout-fixed';
  }

}
