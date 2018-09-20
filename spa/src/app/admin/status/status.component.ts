import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  status = {
    memoryUsage: [],
    mysqlCipher: '',
    maxAllowedPacketSize: 0,
    uptime: 0,
    connections: 0,
    db: {
      host: '',
      database: '',
      connectionLimit: 0
    }
  };

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    this.refreshStatus();
  }

  refreshStatus() {
    this.api.status()
    .subscribe(
    data => {
      console.log(data)
      this.status = data
    },
    err => {
      console.log('Failed loading /api/status', err)
    }
    )
  }

}
