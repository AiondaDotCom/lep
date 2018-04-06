import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ApiService } from '../../api/api.service';
import { MessageService } from '../../message.service';
import { SetupService } from '../setup.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})

export class AuthComponent implements OnInit {
  setupAuthenticationForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private api: ApiService,
    private messageService: MessageService,
    private setupService: SetupService
  ) { }

  ngOnInit() {
    this.setupAuthenticationForm = this.fb.group({
      'setupToken': ['', Validators.required],
    });
  }

  setupAuthentication() {
    let token = this.setupAuthenticationForm.value.setupToken
    console.log(`Testing token (${token})`)
    this.api.verifySetupToken(token)
      .subscribe(
      result => {
        this.messageService.success(result.message)
        this.setupService.unlockStep(3);
        this.setupService.navigateStep(2);
      },
      err => {
        this.messageService.error(err.error.message);
        console.log(err);
      });
  }

}
