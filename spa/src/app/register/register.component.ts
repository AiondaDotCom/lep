import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forbiddenNameValidator } from '../auth/whitelisted-domains.directive';

import { AuthService } from '../auth/auth.service';

import { User } from '../user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  requestRegistrationMode: boolean;
  error = false;
  registerMessage = '';
  token: string;
  newUser: User;
  myEmail = '';

  requestRegistrationForm: FormGroup;

  get requestRegistrationEmail() { return this.requestRegistrationForm.get('requestRegistrationEmail'); }

  ngOnInit(): void {
    this.requestRegistrationForm = new FormGroup({
      'requestRegistrationEmail': new FormControl('', // Default value
        [
          Validators.required,
          Validators.email,
          forbiddenNameValidator()
        ])
    });


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
    }
  }

  requestRegistration(): void {
    // TODO: check if email-domain is whitelisted
    this.authService.requestRegistration(this.requestRegistrationForm.value.requestRegistrationEmail)
      .subscribe(
      result => {
        this.error = false;
        //console.log(result.jwt);
        this.registerMessage = `Check your inbox to complete the registration`;
      },
      err => {
        this.error = true;
        this.registerMessage = `ERROR: ${err.message}`;
        console.log(err);
      }
      );
  }

  register(): void {
    console.log('REGISTER')
    this.authService.register(this.newUser, this.token)
      .subscribe(
      result => {
        this.error = false;
        //console.log(result.jwt);
        console.log(result);
        this.registerMessage = result.message;
      },
      err => {
        this.error = true;
        this.registerMessage = `ERROR: ${err.message}`;
        console.log(err);
      }
      );
  }

}
