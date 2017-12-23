import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  name: string;
  password: string;
  loginMessage: string;
  error: boolean;
  success: boolean;

  constructor() { }

  ngOnInit() {
  }

  signIn(): void {
    console.log('logging in!')
    console.log(this.name, this.password);
    
    this.error = false;
    this.loginMessage = "Login successful!";

    this.error = true;
    this.loginMessage = "Login failed...";
  }

}
