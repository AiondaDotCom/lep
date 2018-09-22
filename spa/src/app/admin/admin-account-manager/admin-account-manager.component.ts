import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../api/api.service';
import { MessageService } from '../../message.service';

import { User } from '../../user';

@Component({
  selector: 'app-admin-account-manager',
  templateUrl: './admin-account-manager.component.html',
  styleUrls: ['./admin-account-manager.component.css']
})
export class AdminAccountManagerComponent implements OnInit {

  accountList = []
  editUserModalRef;
  editUsername: string;

  deleteUserModalRef;
  deleteUsername: string;

  createUserModalRef;
  createUserErrorMessage: string;

  myUser = new User('');
  newUser = new User('');


  constructor(
    private api: ApiService,
    private modalService: NgbModal,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.refreshAccountlist();
  }

  refreshAccountlist(){
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

  openEditUserModal(content, account) {
    // Open edit user model for the corresponding user
    this.editUsername = account.username;
    this.myUser.email = account.username;
    this.myUser.fullName = account.realname;
    this.myUser.accountState = account.accountstate;
    this.myUser.accountType = account.accounttype;
    this.myUser.userID = account.userID;
    console.log(`select user ${account.username}`)
    this.editUserModalRef = this.modalService.open(content);
  }

  openCreateUserModal(content) {
    this.newUser = new User('');
    this.createUserModalRef = this.modalService.open(content);
  }

  openDeleteUserModal(content, username) {
    this.deleteUsername = username;
    this.deleteUserModalRef = this.modalService.open(content);
  }

  modifyUser() {
    console.log(this.myUser);
  }

  deleteUser(user: User) {
    let deleteID = user.userID;
    console.log(`DELETE USER WITH ID ${deleteID}`)

    this.api.adminDeleteAccount(deleteID)
      .subscribe(
      data => {
        console.log(data)
        this.messageService.success(data.message);
        this.refreshAccountlist();
        this.editUserModalRef.close();
      },
      err => {
        console.log(err)
        //this.createUserErrorMessage = err.error.message;
        this.messageService.error(err.error.message)
      }
      )
  }
  

  createUser() {
    console.log('CREATE USER');
    console.log(this.newUser);

    this.api.adminCreateAccount(this.newUser)
      .subscribe(
      data => {
        console.log(data)
        this.createUserErrorMessage = '';
        this.messageService.success(data.message);
        this.refreshAccountlist();
        this.createUserModalRef.close();
      },
      err => {
        console.log(err)
        this.createUserErrorMessage = err.error.message;
        this.messageService.error(err.error.message)
      }
      )
  }


}
