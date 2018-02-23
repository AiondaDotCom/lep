import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-admin-account-manager',
  templateUrl: './admin-account-manager.component.html',
  styleUrls: ['./admin-account-manager.component.css']
})
export class AdminAccountManagerComponent implements OnInit {

  accountList = []

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getAccountList()
      .subscribe(
        data => {
          console.log(data)
          this.accountList = data
        },
        err => {
          console.log('Failed loading account list')
        }
      )
  }

}
