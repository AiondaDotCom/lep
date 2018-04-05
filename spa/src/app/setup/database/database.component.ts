import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.css']
})
export class DatabaseComponent implements OnInit {

  databaseSetupForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.databaseSetupForm = this.fb.group({
      'databaseURL': ['mysql://root:superSecure@mysql:3306/qgx4mamkob3zgpg7', Validators.required],
      'databaseUser': ['admin', Validators.required],
      'databasePassword': ['superSecure', Validators.required]
    });
  }

  testDatabaseConnection() {
    console.log('Testing connection...')
  }

}
