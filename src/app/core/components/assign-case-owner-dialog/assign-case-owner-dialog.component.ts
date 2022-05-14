import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { CustomerRequestService } from '../../services/customer-request.service';

@Component({
  selector: 'app-assign-case-owner-dialog',
  templateUrl: './assign-case-owner-dialog.component.html'
})
export class AssignCaseOwnerDialogComponent implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private _customerRequestService: CustomerRequestService,
    private _spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data,
    private _snackBar: MatSnackBar,
    private _dialogRef: MatDialogRef<AssignCaseOwnerDialogComponent>
  ) { }

  ngOnInit(): void { }

  assignCaseStatus = 'IDLE';
  assignCase(assignCaseForm: FormGroup) {
    this._spinner.show();
    this.assignCaseStatus = 'PENDING';
    this._customerRequestService
      .patchCustomerRequest(this.data.tranId, [
        {
          op: 'replace',
          path: '/AssignedTo',
          value: assignCaseForm.value.userId,
        },
        {
          op: 'replace',
          path: '/AssignedBy',
          value: localStorage.getItem('userId'),
        },
        {
          op: 'replace',
          path: '/Status',
          value: 'ASSIGNED',
        },
      ])
      .pipe(finalize(() => this._spinner.hide()))
      .subscribe(
        (data) => {
          this._snackBar.open('Case assigned successfully');
          this.assignCaseStatus = 'SUCCESS';
          this._dialogRef.close(data);
          assignCaseForm.reset();
        },
        () => {
          this.assignCaseStatus = 'ERROR';
        }
      );
  }

  assignCaseForm = this._fb.group({
    userId: ['', [Validators.required]],
  });
}
