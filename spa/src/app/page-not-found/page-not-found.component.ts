import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  invalidRoute: any;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.invalidRoute = this.route.snapshot.url;
    console.log(this.invalidRoute);
  }

}
