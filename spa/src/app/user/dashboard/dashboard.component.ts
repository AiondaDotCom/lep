import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../auth/auth.service';
import { ApiService } from '../../api/api.service';
import { LoadingIndicatorService } from '../../loading-indicator/loading-indicator.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  restrictedContent: string;
  uploadFileList: FileList;

  uploadError: boolean;
  uploadMessage: string;

  constructor(
    public authService: AuthService,
    private api: ApiService,
    private spinnerService: LoadingIndicatorService
  ) { }

  ngOnInit() {
  }

  requestRestricted() {
    console.log("request restricted content...");
    this.spinnerService.start('requestRestrictedContent');
    this.api.restricted().subscribe(
      result => {
        console.log(result);
        this.restrictedContent = result;
        this.spinnerService.stop('requestRestrictedContent');

      },
      err => {
        console.log(err);
        this.restrictedContent = err;
        this.spinnerService.stop('requestRestrictedContent');
      }
    );
  }

  downloadDocument() {
    this.api.downloadDocument();
  }

  handleFileInput(files: FileList) {
    this.uploadFileList = files;
    console.log(files);
  }

  triggerUpload() {
    console.log('Uploading...');
    this.spinnerService.start('uploadFile');

    let file = this.uploadFileList[0];
    this.api.postFile(file).subscribe(data => {
      // do something, if upload success
      this.uploadError = false;
      this.uploadMessage = `Successful upload`;
      this.spinnerService.stop('uploadFile');
    }, err => {
      this.uploadError = true;
      let message = err.error.message ? err.error.message : 'error uploading file';
      this.uploadMessage = message;
      console.log(err);
      this.spinnerService.stop('uploadFile');
    });
  }

}
