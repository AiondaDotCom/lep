import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.css']
})
export class AccountManagementComponent implements OnInit {

  loginLogList = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.requestLoginLog()
  }

  requestLoginLog() {
    this.api.getLoginLog().subscribe(
      result => {
        console.log(result);
        this.loginLogList = result;
      },
      err => {
        console.log(err);
        //this.restrictedContent = err;
      }
    );
  }

}
