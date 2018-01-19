import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

// Workaround (ERROR: Cannot find name 'require')
// Source: https://stackoverflow.com/questions/43476135/angular-4-cannot-find-name-require
// TODO: Better solution
declare var require: any;

export function forbiddenNameValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    // Load the domain whitelist via webpack
    let domainWhitelist = require('../../../../assets/police_domain_names.json')

    let email = control.value;

    // Source: https://stackoverflow.com/questions/18371339/how-to-retrieve-name-from-email-address#18371348
    //let name   = email.substring(0, email.lastIndexOf("@"));
    let domain = email.substring(email.lastIndexOf("@") + 1);

    // TODO: search complete object (Depending on locale?)
    let whitelisted = domainWhitelist['DE'].includes(domain);

    // The domain is forbidden, if it is not whitelisted
    const forbidden = !whitelisted;

    return forbidden ? { 'forbiddenName': { value: control.value } } : null;
  };
}

@Directive({
  selector: '[appForbiddenName]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ForbiddenValidatorDirective, multi: true }]
})

export class ForbiddenValidatorDirective implements Validator {
  @Input() forbiddenName: string;

  validate(control: AbstractControl): { [key: string]: any } {
    return this.forbiddenName ? forbiddenNameValidator()(control)
      : null;
  }
}
