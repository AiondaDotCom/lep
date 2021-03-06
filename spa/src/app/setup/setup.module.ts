import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { SetupRoutingModule } from './setup-routing.module';
import { RegisterModule } from '../register/register.module';

import { SetupComponent } from './setup.component';
import { AuthComponent } from './auth/auth.component';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { DatabaseComponent } from './database/database.component';
import { FinishComponent } from './finish/finish.component';
import { SetupService } from './setup.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    ReactiveFormsModule,
    SetupRoutingModule,
    RegisterModule
  ],
  declarations: [
    SetupComponent,
    AuthComponent,
    CreateAdminComponent,
    DatabaseComponent,
    FinishComponent
  ],
  providers: [SetupService]
})
export class SetupModule { }
