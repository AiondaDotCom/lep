import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.css']
})
export class EditUserModalComponent implements OnInit {

  newUser = {
    accountType: 'user',
    username: ''
  }

  constructor() { }

  ngOnInit() {
  }


  createUser() {
    console.log('Create user!')
  }

}
