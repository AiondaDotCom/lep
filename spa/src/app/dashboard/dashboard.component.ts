import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  restrictedContent: string;

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

  requestRestricted() {
    console.log("request restricted content...");
    console.log(this.authService.user)
    this.authService.restricted().subscribe(
      result => {
        console.log(result);
        this.restrictedContent = result;
      },
      err => {
        console.log(err);
        this.restrictedContent = err;
      }
    );
  }

}
