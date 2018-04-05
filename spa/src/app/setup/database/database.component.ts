import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ApiService } from '../../api/api.service';
import { MessageService } from '../../message.service';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.css']
})
export class DatabaseComponent implements OnInit {

  databaseSetupForm: FormGroup;
  connectionTestResult: string;

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.databaseSetupForm = this.fb.group({
      'databaseURL': ['mysql://root:superSecure@mysql:3306/qgx4mamkob3zgpg7', Validators.required],
      'databaseUser': ['admin', Validators.required],
      'databasePassword': ['superSecure', Validators.required]
    });
  }

  testDatabaseConnection() {
    let url = this.databaseSetupForm.value.databaseURL;

    console.log('Testing connection...')
    // TODO: Use special token
    this.api.testDatabaseConnection(localStorage.getItem('jwt'), url)
      .subscribe(
      result => {
        //this.error = false;
        this.connectionTestResult = result.message;
        this.messageService.success(result.message)
      },
      err => {
        //this.error = true;
        this.connectionTestResult = `ERROR: ${err.error.message}`;
        this.messageService.error(err.error.message);
        console.log(err);
      });
  }

}
