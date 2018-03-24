import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes, CanActivate } from '@angular/router';

import { AuthGuardSetup } from './setup.guard';

import { SetupComponent } from './setup.component';

const routes: Routes = [
  {
    path: 'setup',
    component: SetupComponent,
    canActivate: [
      AuthGuardSetup
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
