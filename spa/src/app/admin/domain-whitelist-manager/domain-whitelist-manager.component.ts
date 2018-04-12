import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-domain-whitelist-manager',
  templateUrl: './domain-whitelist-manager.component.html',
  styleUrls: ['./domain-whitelist-manager.component.css']
})
export class DomainWhitelistManagerComponent implements OnInit {

  domainWhitelistForm: FormGroup;


  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.domainWhitelistForm = this.fb.group({
      'domain': ['', Validators.required]
    });
  }

  open(content) {
    this.modalService.open(content);
  }

  saveDomain() {
    let domain = this.domainWhitelistForm.value.domain;
    console.log(domain)

  }


}
