import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { Router } from '@angular/router';
import { MomentModule } from 'angular2-moment';

// Import user role specific modules
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { ModeratorModule } from './moderator/moderator.module';

import { LoginModule } from './login/login.module';

// Import services
import { AuthService } from './auth/auth.service';
import { MessageService } from './message.service';
import { ApiService } from './api/api.service';

// Import directives
import { WhitelistdDomainValidatorDirective } from './auth/whitelisted-domains.directive';

// Toplevel components
import { RegisterComponent } from './register/register.component';
import { HelpComponent } from './help/help.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LegalNoticeComponent } from './shared/legal-notice/legal-notice.component';

import { SettingsComponent } from './user/settings/settings.component';
import { AccountManagementComponent } from './shared/account-management/account-management.component';
import { MiscellaneousComponent } from './user/settings/miscellaneous/miscellaneous.component';


@NgModule({
  declarations: [
    AppComponent,
    WhitelistdDomainValidatorDirective,
    // Toplevel components
    PageNotFoundComponent,
    RegisterComponent,
    HelpComponent,
    LegalNoticeComponent,
    //
    SettingsComponent,
    AccountManagementComponent,
    MiscellaneousComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    //
    AdminModule,
    UserModule,
    ModeratorModule,
    LoginModule,
    //
    AppRoutingModule,
    MomentModule
  ],
  providers: [AuthService, MessageService, ApiService],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(router: Router) {
    // Debug information of router configuration
    console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }
}
