import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.css']
})
export class AccountManagementComponent implements OnInit {

  loginLogList = [
    {
      error: true,
      message: 'entry 1'
    },
    {
      error: false,
      message: 'entry 2'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
