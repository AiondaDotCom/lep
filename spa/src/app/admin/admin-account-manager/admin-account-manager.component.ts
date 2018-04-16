import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-admin-account-manager',
  templateUrl: './admin-account-manager.component.html',
  styleUrls: ['./admin-account-manager.component.css']
})
export class AdminAccountManagerComponent implements OnInit {

  accountList = []
  editUserModalRef;
  editUsername: string;

  constructor(
    private api: ApiService,
    private modalService: NgbModal
  ) { }

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

  openEditUserModal(content, username) {
    // Open edit user model for the corresponding user
    this.editUsername = username;
    this.editUserModalRef = this.modalService.open(content);
    console.log(`select user ${username}`)
  }

}
