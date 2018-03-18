import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';

import { LoadingIndicatorModule } from '../loading-indicator/loading-indicator.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingIndicatorModule
  ],
  declarations: [
    LoginComponent
  ]
})

export class LoginModule { }
