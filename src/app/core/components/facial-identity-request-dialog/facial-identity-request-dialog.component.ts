import { FormBuilder, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { CustomerRequestService } from '../../services/customer-request.service';
import { CardRequestDialogComponent } from '../card-request-dialog/card-request-dialog.component';

@Component({
  selector: 'app-facial-identity-request-dialog',
  templateUrl: './facial-identity-request-dialog.component.html'
})
export class FacialIdentityRequestDialogComponent implements OnInit {
  constructor(private readonly _fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<CardRequestDialogComponent>,
              private spinner: NgxSpinnerService,
              private customerRequestService: CustomerRequestService,
              private snackBar: MatSnackBar) { }

  get facialIdentityRequestStatus(): any {
    return this.data.caseDetail?.facialIdentityRequestDetails?.status;
  }
  get facialIdentityRequestConfidence(): any {
    return this.data.caseDetail?.facialIdentityRequestDetails?.confidence;
  }
  get responsePhoto(): any {
    return this.data.caseDetail?.facialIdentityRequestDetails?.responsePhoto;
  }

  facialIdentityRequestFormGroup = this._fb.group({
    identityType: ['bvn_facial', [Validators.required]],
    identityNumber: [this.data.caseDetail.bvn, [Validators.required]],
    requestPhoto: [null, [Validators.required]]
  });

  facialIdentityRequestControls = {
    identityType: this.facialIdentityRequestFormGroup.get('identityType'),
    identityNumber: this.facialIdentityRequestFormGroup.get('identityNumber'),
    requestPhoto: this.facialIdentityRequestFormGroup.get('requestPhoto'),
  };

  sendFacialIdentityRequestFormStatus = 'IDLE';

  ngOnInit(): void {
    if (this.data.caseDetail.facialIdentityRequestDetails?.identityType) {
      this.facialIdentityRequestControls.identityType.setValue(this.data.caseDetail.facialIdentityRequestDetails?.identityType);
    }
    if (this.data.caseDetail.facialIdentityRequestDetails?.identityNumber) {
      this.facialIdentityRequestControls.identityNumber.setValue(this.data.caseDetail.facialIdentityRequestDetails?.identityNumber);
    }
    if (this.data.caseDetail.facialIdentityRequestDetails?.requestPhoto) {
      this.facialIdentityRequestControls.requestPhoto.setValue(this.data.caseDetail.facialIdentityRequestDetails?.requestPhoto);
    }
  }

  documentUploadComplete(data: any) {
    if (data.responseCode === '00') {
      this.facialIdentityRequestControls.requestPhoto.setValue(data.data.base64);
    }
  }

  facialIdentityRequest(data) {
    console.log(data);
    if (
      this.facialIdentityRequestFormGroup.status !== 'VALID' ||
      this.sendFacialIdentityRequestFormStatus === 'PENDING'
    ) {
      return;
    }
    this.spinner.show();
    this.sendFacialIdentityRequestFormStatus = 'PENDING';


    if (!this.facialIdentityRequestStatus) {
      this.customerRequestService.initiateFacialIdentityRequest({
        identityType: data.identityType,
        identityNumber: data.identityNumber,
        requestPhoto: data.requestPhoto,
        initiatedBy:
          this.data.caseDetail.assignedBy || localStorage.getItem('userId'),
        approvedBy: localStorage.getItem('userId'),
        customerRequestTicketId: this.data.caseDetail.tranId,
      })
        .pipe(finalize(() => this.spinner.hide()))
        .subscribe(
          () => {
            this.sendFacialIdentityRequestFormStatus = 'SUCCESS';
            this.facialIdentityRequestFormGroup.reset();
            this.facialIdentityRequestFormGroup.setErrors(null);
            Object.keys(this.facialIdentityRequestFormGroup.controls).forEach((key) => {
              this.facialIdentityRequestFormGroup.get(key).setErrors(null);
            });
            this.snackBar.open(
              'Facial Identity request initiated successfully'
            );
            this.dialogRef.close();
          },
          (error) => {
            this.sendFacialIdentityRequestFormStatus = 'ERROR';
            this.snackBar.open(error);
          }
        );
    } else if (this.facialIdentityRequestStatus === 'INITIATED') {
      this.customerRequestService.approveFacialIdentityRequest({
        identityType: data.identityType,
        identityNumber: data.identityNumber,
        requestPhoto: data.requestPhoto,
        initiatedBy:
          this.data.caseDetail.assignedBy || localStorage.getItem('userId'),
        approvedBy: localStorage.getItem('userId'),
        customerRequestTicketId: this.data.caseDetail.tranId,
      })
        .pipe(finalize(() => this.spinner.hide()))
        .subscribe(
          () => {
            this.sendFacialIdentityRequestFormStatus = 'SUCCESS';
            this.facialIdentityRequestFormGroup.reset();
            this.facialIdentityRequestFormGroup.setErrors(null);
            Object.keys(this.facialIdentityRequestFormGroup.controls).forEach((key) => {
              this.facialIdentityRequestFormGroup.get(key).setErrors(null);
            });
            this.snackBar.open(
              'Facial Identity request successful'
            );
            // this.dialogRef.close(true);
            location.reload();
          },
          (error) => {
            this.sendFacialIdentityRequestFormStatus = 'ERROR';
            this.snackBar.open(error);
          }
        );
    }
  }

}
