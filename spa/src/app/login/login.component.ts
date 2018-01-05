import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';

import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {

  model = new User('', '');
  loginMessage: string;
  error: boolean;
  success: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    //console.log(this.authService.testVar);
  }

  signIn(): void {
    // TODO: check if email-domain is whitelisted

    this.authService.login(this.model)
      .subscribe(
      result => {
        this.error = false;
        console.log(result.jwt);
        this.loginMessage = `Login successful\n(privileges: ${result.accountType})`;
        this.authService.isLoggedIn = true;
      },
      err => {
        this.error = true;
        this.loginMessage = `ERROR: ${err.message}`;
        console.log(err);
        this.authService.isLoggedIn = false;

      }
      );

  }

}
