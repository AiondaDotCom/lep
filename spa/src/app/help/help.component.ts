import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  domainWhitelist: string[];

  constructor(private route: ActivatedRoute) {
    // TODO: Select correct list, depending on locale
    this.domainWhitelist = require('../../../../assets/police_domain_names.json')['DE'].sort()
  }

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
