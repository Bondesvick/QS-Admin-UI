import { Component, Input, OnInit } from '@angular/core';
import startCase from 'lodash.startcase';
import { parseCustomerRequest } from '../../../core/helpers/parseCustomerRequest';

@Component({
  selector: 'app-module-details',
  templateUrl: './module-details.component.html'
})
export class ModuleDetailsComponent implements OnInit {
  @Input() customerRequest;
  @Input() customerRequestDetails;

  get customerRequestDetailsKeys() {
    return Object.keys(this.customerRequestDetails || {});
  }

  get signatureImages() {
    return parseCustomerRequest(this.customerRequest).documents?.filter(doc => { return doc.documentFullName?.toLowerCase().includes('signature') })
  }

  startCase(stringValue) {
    return startCase(stringValue);
  }

  typeOfValue(value) {
    return typeof value;
  }

  constructor() { }

  ngOnInit(): void { }
}
