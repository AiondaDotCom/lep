import { NgModule }       from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { CommonModule }   from '@angular/common';

import { SettingsComponent }          from './settings.component';
import { AccountManagementComponent } from './account-management/account-management.component';

import { SettingsRoutingModule } from './settings-routing.module';
import { MiscellaneousComponent } from './miscellaneous/miscellaneous.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SettingsRoutingModule
  ],
  declarations: [
    SettingsComponent,
    AccountManagementComponent,
    MiscellaneousComponent,
  ],
  providers: [
  ]
})
export class SettingsModule {}
