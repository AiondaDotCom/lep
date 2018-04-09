import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { whitelistdDomainValidator } from '../auth/whitelisted-domains.directive';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { MessageService } from '../message.service';

import { User } from '../user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  requestRegistrationMode: boolean;
  token: string;
  newUser: User;
  myEmail = '';

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // Check if parameter ?token=???? is supplied
    let queryParams = this.route.snapshot.queryParams;
    if ('token' in queryParams) {
      console.log(`Token '${queryParams.token}' is supplied`);
      this.requestRegistrationMode = false;
      this.token = queryParams.token;
    }
    else {
      console.log('No Token supplied');
      this.requestRegistrationMode = true;
    }
    if ('email' in queryParams) {
      console.log(`Email adress '${queryParams.email}' is supplied`);
      this.myEmail = queryParams.email;
      //this.newUser = new User(this.myEmail);
    }
    else {
      console.log('No Email adress supplied');
      //this.newUser = new User('');
    }
  }
}
