import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { LoadingIndicatorService } from '../loading-indicator/loading-indicator.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  restrictedContent: string;

  constructor(public authService: AuthService, private spinnerService: LoadingIndicatorService) { }

  ngOnInit() {
  }

  requestRestricted() {
    console.log("request restricted content...");
    this.spinnerService.start('requestRestrictedContent');
    console.log(this.authService.userProfile)
    this.authService.restricted().subscribe(
      result => {
        console.log(result);
        this.restrictedContent = result;
        this.spinnerService.stop('requestRestrictedContent');

      },
      err => {
        console.log(err);
        this.restrictedContent = err;
        this.spinnerService.stop('requestRestrictedContent');

      }
    );
  }

}
