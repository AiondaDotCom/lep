import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { whitelistdDomainValidator } from '../auth/whitelisted-domains.directive';
import { Router } from '@angular/router';

import { matchingPasswords } from './repeat-password-validator';

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
  error = false;
  registerMessage = '';
  token: string;
  newUser: User;
  myEmail = '';

  requestRegistrationForm: FormGroup;
  registrationForm: FormGroup;


  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }


  // shortcuts
  get requestRegistrationEmail() { return this.requestRegistrationForm.get('requestRegistrationEmail'); }
  get passwordConfirm() { return this.registrationForm.get('passwordConfirm'); }

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
      this.newUser = new User(this.myEmail);
    }
    else {
      console.log('No Email adress supplied');
      this.newUser = new User('');
    }

    this.requestRegistrationForm = new FormGroup({
      'requestRegistrationEmail': new FormControl('', // Default value
        [
          Validators.required,
          Validators.email,
          whitelistdDomainValidator()
        ])
    });

    this.registrationForm = this.fb.group({
      'email': {
        value: this.newUser.email,
        disabled: true
      },
      'fullName': ['', Validators.required],
      'password': ['', Validators.required],
      'passwordConfirm': ['', Validators.required]
    }, {
        validator: matchingPasswords('password', 'passwordConfirm')
      });
  }

  requestRegistration(): void {
    let email = this.requestRegistrationForm.value.requestRegistrationEmail;
    this.authService.requestRegistration(email)
      .subscribe(
      result => {
        this.error = false;
        this.registerMessage = `Check your inbox to complete the registration`;
      },
      err => {
        this.error = true;
        this.registerMessage = `ERROR: ${err.error.message}`;
        console.log(err);
      }
      );
  }

  register(): void {
    this.newUser.fullName = this.registrationForm.value.fullName;
    this.newUser.password = this.registrationForm.value.password;

    this.authService.register(this.newUser, this.token)
      .subscribe(
      result => {
        this.error = false;
        console.log(result);
        this.registerMessage = result.message;
        this.messageService.message({
          type: 'success',
          message: 'Registration was successful'
        })
        this.router.navigate(['/login']);
      },
      err => {
        this.error = true;
        this.registerMessage = `ERROR: ${err.error.message}`;
        console.log(err);
      }
      );
  }

}
