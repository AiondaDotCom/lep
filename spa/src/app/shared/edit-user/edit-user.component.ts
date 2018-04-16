import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html'
})
export class EditUserComponent implements OnInit {

  @Input() adminMode: boolean | string = false;

  newUser = {
    accountType: 'user',
    username: ''
  }

  constructor() { }

  ngOnInit() {
    this.adminMode = (this.adminMode == true || this.adminMode == 'true')
  }

  createUser() {
    console.log('Create user!')
  }

}
