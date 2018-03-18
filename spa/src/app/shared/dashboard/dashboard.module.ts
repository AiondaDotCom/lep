import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MomentModule } from 'angular2-moment';

import { LoadingIndicatorModule } from '../../loading-indicator/loading-indicator.module';

import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    MomentModule,
    LoadingIndicatorModule
  ],
  exports: [
    DashboardComponent
  ],
  declarations: [
    DashboardComponent
  ]
})

export class DashboardModule { }
