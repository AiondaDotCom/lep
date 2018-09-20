import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { AuthService } from '../../../auth/auth.service';
import { ApiService } from '../../../api/api.service';
import { MessageService } from '../../../message.service';
import { LoadingIndicatorService } from '../../../loading-indicator/loading-indicator.service';

import { User } from '../../../user';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.css']
})
export class AccountManagementComponent implements OnInit {

  user = new User('');

  constructor(
    private router: Router,
    private authService: AuthService,
    private api: ApiService,
    private messageService: MessageService,
    private spinnerService: LoadingIndicatorService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
  }

  //openEditUserModal(content) {
    //this.modalService.open(EditUserModalComponent);
//  }

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
