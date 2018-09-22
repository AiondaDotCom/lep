import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../user';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html'
})
export class EditUserComponent implements OnInit {

  @Input() adminMode: boolean | string = false;
  @Input() newUser: User;
  @Input() debug: boolean | string = false;

 // newUser = {
 //   accountType: 'user',
 // username: ''
 // }

  constructor() { }

  ngOnInit() {
    this.adminMode = (this.adminMode == true || this.adminMode == 'true')
    this.debug = (this.debug == true || this.debug == 'true')
  }

  createUser() {
    console.log('Create user!')
  }

}
