import { Component, OnInit } from '@angular/core';

import { SetupService } from './setup.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html'
})
export class SetupComponent implements OnInit {

  get allowedStep(){
    return this.setupService.allowedStep;
  }
  
  constructor(
    public setupService: SetupService
  ) { }

  ngOnInit() {
  }

}
