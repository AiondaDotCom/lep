import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SetupRoutingModule } from './setup-routing.module';

import { SetupComponent } from './setup.component';
import { AuthComponent } from './auth/auth.component';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { DatabaseComponent } from './database/database.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    SetupRoutingModule
  ],
  declarations: [
    SetupComponent,
    AuthComponent,
    CreateAdminComponent,
    DatabaseComponent
  ]
})
export class SetupModule { }
