import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { MessageService } from '../../message.service';

@Component({
  selector: 'app-document-manager',
  templateUrl: './document-manager.component.html',
  styleUrls: ['./document-manager.component.css']
})
export class DocumentManagerComponent implements OnInit {

  downloadFileList = [];


  constructor(
    private api: ApiService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadDocumentList();
  }

  loadDocumentList() {
    this.api.getDocumentList().subscribe(
      result => {
        this.downloadFileList = result;
      },
      err => {
        this.downloadFileList = [];
        console.log(err);
      })
  }

  downloadDocument(fileID) {
    this.api.downloadDocument(fileID);
  }

  deleteDocument(fileID) {
    console.log(`Deleting document with id ${fileID}`)
    // TODO: Prevent unwanted deletion
    this.api.deleteDocument(fileID).subscribe(
      result => {
        this.messageService.success(`Deleted Document with ID ${fileID}`)
        this.loadDocumentList();
      },
      err => {
        this.messageService.error(`Error deleting document with ID ${fileID}`)
        console.log(err);
      }
    )}

}
