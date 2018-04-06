import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ApiService } from '../../api/api.service';
import { MessageService } from '../../message.service';

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
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.setupAuthenticationForm = this.fb.group({
      'setupToken': ['', Validators.required],
    });
  }

  setupAuthentication() {
    console.log(`Testing token (${this.setupAuthenticationForm.value.setupToken})`)
  }

}
