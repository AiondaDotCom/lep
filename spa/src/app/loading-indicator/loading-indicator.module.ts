import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingIndicatorComponent } from './loading-indicator.component';
import { LoadingIndicatorService } from './loading-indicator.service';


@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    LoadingIndicatorComponent
  ],
  declarations: [
    LoadingIndicatorComponent
  ],
  providers: [
    LoadingIndicatorService
  ]
})
export class LoadingIndicatorModule { }
