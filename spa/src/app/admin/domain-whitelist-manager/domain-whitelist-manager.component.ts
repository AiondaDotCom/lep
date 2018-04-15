import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../auth/auth.service';
import { ApiService } from '../../api/api.service';
import { MessageService } from '../../message.service';

@Component({
  selector: 'app-domain-whitelist-manager',
  templateUrl: './domain-whitelist-manager.component.html',
  styleUrls: ['./domain-whitelist-manager.component.css']
})
export class DomainWhitelistManagerComponent implements OnInit {

  domainWhitelistForm: FormGroup;

  domainToDelete: string;


  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    private modalService: NgbModal,
    private api: ApiService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.domainWhitelistForm = this.fb.group({
      'domain': ['', Validators.required]
    });
  }

  open(content) {
    this.modalService.open(content);
  }

  confirmDeleteDomain(content, domain: string){
    this.modalService.open(content)
    this.domainToDelete = domain;
  }

  deleteDomain(domain: string){
    console.log(`Delete domain. ${domain}`)
    this.api.removeDomainFromWhitelist(domain)
      .subscribe(
      data => {
        this.messageService.success(data.message);
        this.authService.refreshDomainWhitelist();
      },
      err => {
        this.messageService.error(err.error.message);
      })
  }


  saveDomain() {
    let domain = this.domainWhitelistForm.value.domain;

    this.api.addDomainToWhitelist(domain)
      .subscribe(
      data => {
        this.messageService.success(data.message);
        this.authService.refreshDomainWhitelist();
      },
      err => {
        this.messageService.error(err.error.message);
      })
    console.log(domain)

  }


}
