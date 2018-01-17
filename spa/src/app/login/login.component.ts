import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { MessageService } from '../message.service';

import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit, OnDestroy {

  model = new User('', '');
  loginMessage: string;
  error: boolean;
  success: boolean;

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) { }

  ngOnInit() {
    this.messageService.message('INIT login component')
  }

  ngOnDestroy() {
    // TODO: Unsubscribe if subscribed
    //this.authService.unsubscribe();
  }

  signIn(): void {
    // TODO: check if email-domain is whitelisted

    this.authService.login(this.model)
      .subscribe(
      result => {
        this.error = false;
        console.log(result.jwt);
        this.loginMessage = `Login successful\n(privileges: ${result.accountType})`;

        // Redirect to /dashboard
        this.router.navigate(['/dashboard']);
      },
      err => {
        this.error = true;
        this.loginMessage = `ERROR: ${err.message}`;
        console.log(err);
      }
      );

  }

}
