import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register.component';
import { RequestRegistrationComponent } from './request-registration/request-registration.component';
import { CreateAccountComponent } from './create-account/create-account.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    RegisterComponent,
    RequestRegistrationComponent,
    CreateAccountComponent
  ],
  exports: [
    RegisterComponent,
    CreateAccountComponent,
    RequestRegistrationComponent
  ]
})
export class RegisterModule { }
