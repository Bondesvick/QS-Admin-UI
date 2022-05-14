import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { CustomerRequestService } from '../../services/customer-request.service';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-spool-for-cases-dialog',
  templateUrl: './spool-for-cases-dialog.component.html'
})
export class SpoolForCasesDialogComponent implements OnInit {
  quickServiceModules: any[];

  constructor(
    private _fb: FormBuilder,
    private _customerRequestService: CustomerRequestService,
    private _snackBar: MatSnackBar,
    private _spinner: NgxSpinnerService,
    private _dialogRef: MatDialogRef<SpoolForCasesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit(): void {
    this.quickServiceModules = JSON.parse(
      localStorage.getItem('quickServiceModules')
    )?.filter(
      (each) => !(each.name === 'Anonymous Search'
        || each.link === 'reports'
      )
    );

    if (!this.quickServiceModules.length) {
      this.quickServiceModules = environment.modules;
    }
    if (this.data?.link) {
      this.spoolCasesForm.patchValue({
        module: this.data.link
      })
    }
  }

  spoolCasesForm = this._fb.group({
    startDate: [''],
    endDate: [''],
    treatedStartDate: [''],
    treatedEndDate: [''],
    status: [''],
    ticketId: [''],
    accountNumber: [''],
    bvn: [''],
    module: [''],
  });

  spoolCasesFormStatus = 'IDLE';
  submitSpoolCasesForm() {
    this.spoolCasesFormStatus = 'PENDING';
    this._spinner.show();
    this._customerRequestService
      .getCustomerRequests(this.spoolCasesForm.value)
      .pipe(finalize(() => this._spinner.hide()))
      .subscribe(
        (data) => {
          this.spoolCasesFormStatus = 'SUCCESS';
          this._snackBar.open('Spool Successful');
          this._dialogRef.close({ data, module: this.spoolCasesForm.controls['module'].value });
        },
        () => { }
      );
  }
}
