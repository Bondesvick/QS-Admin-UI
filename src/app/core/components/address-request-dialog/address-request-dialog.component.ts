import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { CustomerRequestService } from '../../services/customer-request.service';
import { numericValidator } from '../../validators/numeric.validator';
import { conditionalValidator } from '../../helpers/conditionalValidator';

@Component({
  selector: 'app-address-request-dialog',
  templateUrl: './address-request-dialog.component.html'
})
export class AddressRequestDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddressRequestDialogComponent>,
    private spinner: NgxSpinnerService,
    private customerRequestService: CustomerRequestService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
  }

  get addressRequestStatus(): any {
    return this.data.caseDetail?.addressRequestDetails?.status;
  }

  addressRequestFormGroup = this.fb.group({
    city: [null, [Validators.required]],
    remarks: [null],
    addressLine1: [null, [Validators.required]],
    addressLine2: [null],
    state: [null, [Validators.required]],
    alias: [null],
    emailAddress: [null, [Validators.email]],
    landMark: [null],
    companyName: [null],
    phoneNumber: [
      null,
      [
        conditionalValidator(() => this.addressRequestFormGroupControls.phoneNumber.value, Validators.compose([
          // Validators.required,
          numericValidator,
          Validators.minLength(11),
          Validators.maxLength(11),
        ]))
      ],
    ],
  });

  addressRequestFormGroupControls = {
    city: this.addressRequestFormGroup.get('city'),
    remarks: this.addressRequestFormGroup.get('remarks'),
    addressLine1: this.addressRequestFormGroup.get('addressLine1'),
    addressLine2: this.addressRequestFormGroup.get('addressLine2'),
    state: this.addressRequestFormGroup.get('state'),
    alias: this.addressRequestFormGroup.get('alias'),
    emailAddress: this.addressRequestFormGroup.get('emailAddress'),
    landMark: this.addressRequestFormGroup.get('landMark'),
    companyName: this.addressRequestFormGroup.get('companyName'),
    phoneNumber: this.addressRequestFormGroup.get('phoneNumber'),
  };

  sendAddressRequestFormStatus = 'IDLE';

  ngOnInit(): void {
    this.dialogRef.afterOpened().subscribe(() => {
      // this.addressRequestFormGroupControls.accountToDebit.setValue(
      //   this.data.caseDetail.cardRequestDetails?.accountToDebit ||
      //   this.data.caseDetail.accountNumber
      // );

      if (this.data.caseDetail.addressRequestDetails?.city || this.data.caseDetail.moduleDetails?.city || this.data.caseDetail.moduleDetails?.cityTown || this.data.caseDetail.moduleDetails?.lga) {
        if (this.data.caseDetail.addressRequestDetails?.city) {
          this.addressRequestFormGroupControls.city.setValue(this.data.caseDetail.addressRequestDetails?.city)
        } else if ((this.data.caseDetail.moduleDetails?.city || this.data.caseDetail.moduleDetails?.cityTown) && this.data.caseDetail.moduleDetails?.lga) {
          this.addressRequestFormGroupControls.city.setValue((this.data.caseDetail.moduleDetails?.city || this.data.caseDetail.moduleDetails?.cityTown) + ', ' + this.data.caseDetail.moduleDetails?.lga)
        } else if (this.data.caseDetail.moduleDetails?.city || this.data.caseDetail.moduleDetails?.cityTown) {
          this.addressRequestFormGroupControls.city.setValue(this.data.caseDetail.moduleDetails?.city || this.data.caseDetail.moduleDetails?.cityTown)
        }
      }
      if (this.data.caseDetail.addressRequestDetails?.state || this.data.caseDetail.moduleDetails?.state) {
        this.addressRequestFormGroupControls.state.setValue(this.data.caseDetail.addressRequestDetails?.state || this.data.caseDetail.moduleDetails?.state)
      }
      if (this.data.caseDetail.addressRequestDetails?.alias || this.data.caseDetail.moduleDetails?.alias) {
        this.addressRequestFormGroupControls.alias.setValue(this.data.caseDetail.addressRequestDetails?.alias || this.data.caseDetail.moduleDetails?.alias)
      }
      if (this.data.caseDetail.addressRequestDetails?.landMark || this.data.caseDetail.moduleDetails?.landmark || this.data.caseDetail.moduleDetails?.busStop) {
        this.addressRequestFormGroupControls.landMark.setValue(this.data.caseDetail.addressRequestDetails?.landMark || this.data.caseDetail.moduleDetails?.landmark || this.data.caseDetail.moduleDetails?.busStop)
      }
      if (this.data.caseDetail.addressRequestDetails?.phoneNumber || this.data.caseDetail.moduleDetails?.phoneNumber) {
        this.addressRequestFormGroupControls.phoneNumber.setValue(this.data.caseDetail.addressRequestDetails?.phoneNumber || this.data.caseDetail.moduleDetails?.phoneNumber)
      }
      if (this.data.caseDetail.addressRequestDetails?.emailAddress || this.data.caseDetail.moduleDetails?.emailAddress || this.data.caseDetail.moduleDetails?.email) {
        this.addressRequestFormGroupControls.emailAddress.setValue(this.data.caseDetail.addressRequestDetails?.emailAddress || this.data.caseDetail.moduleDetails?.emailAddress || this.data.caseDetail.moduleDetails?.email)
      }
      if (this.data.caseDetail.addressRequestDetails?.addressLine1 || this.data.caseDetail.moduleDetails?.houseno || this.data.caseDetail.moduleDetails?.street) {
        this.addressRequestFormGroupControls.addressLine1.setValue(this.data.caseDetail.addressRequestDetails?.addressLine1 || (this.data.caseDetail.moduleDetails?.houseno + ' ' + this.data.caseDetail.moduleDetails?.street))
      } else if (this.data.caseDetail.moduleDetails?.houseNumber || this.data.caseDetail.moduleDetails?.streetName) {
        this.addressRequestFormGroupControls.addressLine1.setValue(this.data.caseDetail.moduleDetails?.houseNumber + ' ' + this.data.caseDetail.moduleDetails?.streetName)
      }
      if (this.data.caseDetail.addressRequestDetails?.remark || this.data.caseDetail.moduleDetails?.houseDescription) {
        this.addressRequestFormGroupControls.remarks.setValue(this.data.caseDetail.addressRequestDetails?.remark || this.data.caseDetail.moduleDetails?.houseDescription)
      }
      if (this.data.caseDetail.addressRequestDetails?.addressLine2) {
        this.addressRequestFormGroupControls.addressLine2.setValue(this.data.caseDetail.addressRequestDetails?.addressLine2)
      }
      if (this.data.caseDetail.addressRequestDetails?.companyName) {
        this.addressRequestFormGroupControls.companyName.setValue(this.data.caseDetail.addressRequestDetails?.companyName)
      }
    });
  }
  addressRequest(requestData: any): void {
    if (
      this.addressRequestFormGroup.status !== 'VALID' ||
      this.sendAddressRequestFormStatus === 'PENDING'
    ) {
      return;
    }
    this.spinner.show();
    this.sendAddressRequestFormStatus = 'PENDING';

    if (this.addressRequestStatus !== 'SUCCESS') {
      this.customerRequestService.approveAddressRequest({
        accountNumber: this.data.caseDetail.accountNumber,
        city: requestData.city,
        remarks: requestData.remarks,
        addressLine1: requestData.addressLine1,
        addressLine2: requestData.addressLine2,
        state: requestData.state,
        alias: requestData.alias,
        emailAddress: requestData.emailAddress,
        landMark: requestData.landMark,
        companyName: requestData.companyName,
        phoneNumber: requestData.phoneNumber,
        initiatedBy:
          this.data.caseDetail.assignedBy || localStorage.getItem('userId'),
        approvedBy: localStorage.getItem('userId'),
        customerRequestTicketId: this.data.caseDetail.tranId
      })
        .pipe(finalize(() => this.spinner.hide()))
        .subscribe(
          () => {
            this.sendAddressRequestFormStatus = 'SUCCESS';
            this.addressRequestFormGroup.reset();
            this.addressRequestFormGroup.setErrors(null);
            Object.keys(this.addressRequestFormGroup.controls).forEach((key) => {
              this.addressRequestFormGroup.get(key).setErrors(null);
            });
            this.snackBar.open(
              'Address request approved successfully'
            );
            this.dialogRef.close(true);
          },
          (error) => {
            this.sendAddressRequestFormStatus = 'ERROR';
            this.snackBar.open(error);
          }
        );
    } else {
      return;
    }
  }
}
