import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { parseCustomerRequest } from '../../helpers/parseCustomerRequest';

@Component({
  selector: 'app-case-details-dialog',
  templateUrl: './case-details-dialog.component.html'
})
export class CaseDetailsDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public customerRequest) {}
  get getCustomerRequestDetails() {
    return parseCustomerRequest(this.customerRequest).details;
  }

  ngOnInit(): void {}
}
