import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { whitelistdDomainValidator } from '../../auth/whitelisted-domains.directive';
import { matchingPasswords } from '.././repeat-password-validator';
import { AuthService } from '../../auth/auth.service';
import { MessageService } from '../../message.service';
import { User } from '../../user';

@Component({
  selector: 'app-request-registration',
  templateUrl: './request-registration.component.html',
  styleUrls: ['./request-registration.component.css']
})
export class RequestRegistrationComponent implements OnInit {

  requestRegistrationForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  get requestRegistrationEmail() { return this.requestRegistrationForm.get('requestRegistrationEmail'); }


  ngOnInit() {
    this.requestRegistrationForm = new FormGroup({
      'requestRegistrationEmail': new FormControl('', // Default value
        [
          Validators.required,
          Validators.email,
          whitelistdDomainValidator()
        ])
    });
  }


  requestRegistration(): void {
    let email = this.requestRegistrationForm.value.requestRegistrationEmail;
    this.authService.requestRegistration(email)
      .subscribe(
      result => {
        this.messageService.success(`Check your inbox to complete the registration`);
      },
      err => {
        this.messageService.error(`ERROR: ${err.error.message}`);
        console.log(err);
      }
      );
  }

}
