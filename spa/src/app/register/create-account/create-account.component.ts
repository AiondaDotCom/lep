import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { whitelistdDomainValidator } from '../../auth/whitelisted-domains.directive';
import { matchingPasswords } from '.././repeat-password-validator';
import { AuthService } from '../../auth/auth.service';
import { MessageService } from '../../message.service';
import { User } from '../../user';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})


export class CreateAccountComponent implements OnInit {

  @Input() editEmailDisabled: boolean | string = true;
  @Input() token: string;
  @Input() email: string;

  newUser: User;
  registrationForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  get passwordConfirm() { return this.registrationForm.get('passwordConfirm'); }
  //get email() { return this.registrationForm.get('email'); }

  ngOnInit() {
    if (this.email) {
      this.newUser = new User(this.email);
    }
    else {
      this.newUser = new User('');
    }

    this.registrationForm = this.fb.group({
      'email': {
        value: this.newUser.email,
        disabled: (this.editEmailDisabled == true || this.editEmailDisabled == 'true')
      },
      'fullName': ['', Validators.required],
      'password': ['', Validators.required],
      'passwordConfirm': ['', Validators.required]
    }, {
        validator: matchingPasswords('password', 'passwordConfirm')
      });
  }


  register(): void {
    this.newUser.fullName = this.registrationForm.value.fullName;
    this.newUser.password = this.registrationForm.value.password;
    this.newUser.email = this.registrationForm.value.email;

    this.authService.register(this.newUser, this.token)
      .subscribe(
      result => {
        console.log(result);
        this.messageService.success(result.message)
      },
      err => {
        console.log(err);
        this.messageService.error(err.error.message);
      }
      );
  }

}
