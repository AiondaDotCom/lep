import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { LoadingIndicatorModule } from '../loading-indicator/loading-indicator.module';

import { AuthService } from '../auth/auth.service';
import { MessageService } from '../message.service';
import { LoadingIndicatorService } from '../loading-indicator/loading-indicator.service';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private spinnerService: LoadingIndicatorService) {
    // Check if the user is already logged in and redirect to dashboard
    if (this.authService.authenticated) {
      this.router.navigate([`/${this.authService.accountType}/dashboard`]);
    }
  }

  ngOnInit() { }

  ngOnDestroy() {
    // TODO: Unsubscribe if subscribed
    //this.authService.unsubscribe();
  }

  signIn(): void {
    // TODO: check if email-domain is whitelisted
    this.spinnerService.start('signIn')

    this.authService.login(this.model)
      .subscribe(
      result => {
        this.spinnerService.stop('signIn')

        this.error = false;
        console.log(result.jwt);
        this.loginMessage = `Login successful\n(privileges: ${result.accountType})`;

        this.messageService.message({ type: 'info', message: 'Successful login' })

        // Redirect to /dashboard
        this.router.navigate([`/${this.authService.accountType}/dashboard`]);
      },
      err => {
        this.spinnerService.stop('signIn')

        if (err.status == 401) {
          // Unauthorized
        }
        this.error = true;
        this.loginMessage = `ERROR: ${err.error.message}`;
        this.messageService.message({ type: 'danger', message: 'Error logging in' })

        console.log(err);
      }
      );

  }

}
