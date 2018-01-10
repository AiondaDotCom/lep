import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  error = false;
  myEmail = '';
  registerMessage = '';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    // Check if parameter ?token=???? is supplied
  }

  register(): void {
    // TODO: check if email-domain is whitelisted
    this.authService.register(this.myEmail)
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

}
