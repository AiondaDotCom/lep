import { Component, OnInit } from '@angular/core';

import { SetupService } from '../setup.service';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css']
})
export class CreateAdminComponent implements OnInit {

  setupToken: string;

  constructor(
    private setupService: SetupService
  ) { }

  ngOnInit() {
    this.setupToken = localStorage.getItem('setupToken');
  }

}
