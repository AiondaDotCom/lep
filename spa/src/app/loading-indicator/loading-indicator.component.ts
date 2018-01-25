import { Component, OnInit, Input } from '@angular/core';

import { LoadingIndicatorService } from './loading-indicator.service';

@Component({
  selector: 'loading-indicator',
  template: `<img *ngIf="isVisible" src="assets/loadingWhite.svg">`
})

export class LoadingIndicatorComponent implements OnInit {

  @Input() spinnerName: string;

  constructor( private loadingIndicatorService: LoadingIndicatorService ) { }

  ngOnInit() {
    if(!this.spinnerName){
      console.error('Parameter spinnerName missing..')
    }
    this.loadingIndicatorService.register(this.spinnerName)
  }

  get isVisible(){
    return this.loadingIndicatorService.isActive(this.spinnerName)
  }

}
