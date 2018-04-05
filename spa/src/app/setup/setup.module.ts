import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { SetupRoutingModule } from './setup-routing.module';

import { SetupComponent } from './setup.component';
import { AuthComponent } from './auth/auth.component';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { DatabaseComponent } from './database/database.component';
import { FinishComponent } from './finish/finish.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    ReactiveFormsModule,
    SetupRoutingModule
  ],
  declarations: [
    SetupComponent,
    AuthComponent,
    CreateAdminComponent,
    DatabaseComponent,
    FinishComponent
  ]
})
export class SetupModule { }
