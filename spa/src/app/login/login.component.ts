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

  //email: string;
  //password: string;
  loginMessage: string;
  error: boolean;
  success: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  signIn(): void {
    console.log(this.model.email, this.model.password);

    // TODO: Detect if login was successful
    this.error = false;
    this.authService.login(this.model)
            .subscribe(result => this.loginMessage = result);
            //.subscribe(result => console.log(result));


    //this.error = false;
    //this.loginMessage = "Login successful!";

    //this.error = true;
    //this.loginMessage = "Login failed...";
  }

}
