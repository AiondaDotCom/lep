import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { SettingsModule }      from './settings/settings.module';
import { Router } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';

import { AuthService } from './auth/auth.service';
import { WhitelistdDomainValidatorDirective } from './auth/whitelisted-domains.directive';
import { MessageService } from './message.service';
import { HelpComponent } from './help/help.component';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { LoadingIndicatorService } from './loading-indicator/loading-indicator.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    PageNotFoundComponent,
    RegisterComponent,
    WhitelistdDomainValidatorDirective,
    HelpComponent,
    LoadingIndicatorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    SettingsModule,
    AppRoutingModule
  ],
  providers: [AuthService, MessageService, LoadingIndicatorService],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(router: Router) {
    // Debug information of router configuration
    console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }
}
