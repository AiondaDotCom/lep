import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes, CanActivate } from '@angular/router';

import { AuthGuardSetup } from './setup.guard';

import { SetupComponent } from './setup.component';
import { AuthComponent } from './auth/auth.component';
import { CreateAdminComponent } from './create-admin/create-admin.component';

const routes: Routes = [
  {
    path: 'setup',
    component: SetupComponent,
    canActivate: [
      AuthGuardSetup
    ],
    children: [
      {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
      },
      {
        path: 'auth',
        component: AuthComponent
      },
      {
        path: 'create-admin',
        component: CreateAdminComponent
      }
    ]
  }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: [],
  providers: [AuthGuardSetup]
})


export class SetupRoutingModule { }
