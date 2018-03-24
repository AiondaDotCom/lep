import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupRoutingModule } from './setup-routing.module';

import { SetupComponent } from './setup.component';

@NgModule({
  imports: [
    CommonModule,
    SetupRoutingModule
  ],
  declarations: [
    SetupComponent
  ]
})
export class SetupModule { }
