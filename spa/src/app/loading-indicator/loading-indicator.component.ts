import { Component, OnInit, Input } from '@angular/core';

import { LoadingIndicatorService } from './loading-indicator.service';

@Component({
  selector: 'loading-indicator',
  template: `<span *ngIf="isVisible">
                <img [src]="myFilePath">
                <span *ngIf="message">{{message}}</span>
             </span>`
})

export class LoadingIndicatorComponent implements OnInit {

  // Default spinner
  myFilePath = 'assets/loadingWhite.svg';

  @Input() spinnerFilePath: string;
  @Input() spinnerName: string;
  @Input() message: string;

  constructor( private loadingIndicatorService: LoadingIndicatorService ) { }

  ngOnInit() {
    if(!this.spinnerName){
      console.error('Parameter spinnerName missing..')
    }

    if(this.spinnerFilePath){
      this.myFilePath = this.spinnerFilePath
    }

    this.loadingIndicatorService.register(this.spinnerName)
  }

  get isVisible(){
    return this.loadingIndicatorService.isActive(this.spinnerName)
  }

}
