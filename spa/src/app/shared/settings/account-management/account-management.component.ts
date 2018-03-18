import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../auth/auth.service';
import { ApiService } from '../../../api/api.service';
import { MessageService } from '../../../message.service';
import { LoadingIndicatorService } from '../../../loading-indicator/loading-indicator.service';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.css']
})
export class AccountManagementComponent implements OnInit {

  loginLogList = [];
  myIP;

  constructor(
    private router: Router,
    private authService: AuthService,
    private api: ApiService,
    private messageService: MessageService,
    private spinnerService: LoadingIndicatorService
  ) { }

  ngOnInit() {
    this.requestLoginLog()
  }

  requestLoginLog() {
    this.spinnerService.start('loadLoginLog')

    this.api.whatIsMyIP().subscribe(
      result => {
        this.myIP = result.ip
      },
      err => {
        console.log(err);
      }
    );

    this.api.getLoginLog().subscribe(
      result => {
        this.spinnerService.stop('loadLoginLog')
        console.log(result);
        this.loginLogList = result;
      },
      err => {
        console.log(err);
        this.spinnerService.stop('loadLoginLog')
      }
    );
  }

  deleteAccount() {
    let username = 'changeme';
    let password = 'test';
    this.api.deleteAccount(username, password).subscribe(
      result => {
        console.log(result);
        this.messageService.message({
          type: 'info',
          message: 'Account deleted successfully'
        })
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      err => {
        console.log(err);
        this.messageService.message({
          type: 'danger',
          message: 'Account could not be deleted'
        })
      }
    );
  }

}
