import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';

// Workaround (ERROR: Cannot find name 'require')
// Source: https://stackoverflow.com/questions/43476135/angular-4-cannot-find-name-require
// TODO: Better solution
declare var require: any;

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  fragment: string;

  constructor(public authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.fragment.subscribe(fragment => { this.fragment = fragment; });
  }

  ngAfterViewInit(): void {
    // Source: https://stackoverflow.com/questions/36101756/angular2-routing-with-hashtag-to-page-anchor#36101788
    // Scrolls to the id corresponding to the fragment
    try {
      document.querySelector('#' + this.fragment).scrollIntoView();
    } catch (e) { }
  }

}
