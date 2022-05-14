import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { CustomerRequestService } from '../../services/customer-request.service';
import { numericValidator } from '../../validators/numeric.validator';

@Component({
  selector: 'app-card-request-dialog',
  templateUrl: './card-request-dialog.component.html'
})
export class CardRequestDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CardRequestDialogComponent>,
    private spinner: NgxSpinnerService,
    private customerRequestService: CustomerRequestService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
  }

  get cities(): any {
    return this.data.cardRequestData.cities.map(
      (eachObject: any) => eachObject.city
    );
  }

  get currencies(): any {
    return this.data.cardRequestDatapreferredNameOnCard.currencies.map(
      (eachObject: any) => eachObject.currency
    );
  }

  get genders(): any {
    return this.data.cardRequestData.genders;
  }

  get titles(): any {
    return this.data.cardRequestData.titles.map(
      (eachObject: any) => eachObject.customerTitleCode
    );
  }

  get maritalStatuses(): any {
    return this.data.cardRequestData.maritalStatuses.map(
      (eachObject: any) => eachObject.maritalStatus
    );
  }

  get branches(): any {
    return this.data.cardRequestData.branches;
  }

  get cards(): any {
    return this.data.cardRequestData.eligibleCards.map(
      (eachObject: any) => eachObject.programe_name
    );
  }

  get cardRequestStatus(): any {
    return this.data.caseDetail?.cardRequestDetails?.status;
  }

  cardRequestFormGroup = this.fb.group({
    city: [null, [Validators.required]],
    customerTitle: [null, [Validators.required]],
    maritalStatus: [null, [Validators.required]],
    customerGender: [null, [Validators.required]],
    initiatingBranch: [null, [Validators.required]],
    collectionBranch: [null, [Validators.required]],
    cardType: [null, [Validators.required]],
    preferredNameOnCard: [null, [Validators.required, Validators.maxLength(19)]],
    accountToDebit: [
      null,
      [
        Validators.required,
        numericValidator,
        Validators.minLength(10),
        Validators.maxLength(10),
      ],
    ],
  });
  cardRequestFormGroupControls = {
    accountToDebit: this.cardRequestFormGroup.get('accountToDebit'),
    accountName: this.cardRequestFormGroup.get('preferredNameOnCard'),
    city: this.cardRequestFormGroup.get('city'),
    customerTitle: this.cardRequestFormGroup.get('customerTitle'),
    maritalStatus: this.cardRequestFormGroup.get('maritalStatus'),
    customerGender: this.cardRequestFormGroup.get('customerGender'),
    initiatingBranch: this.cardRequestFormGroup.get('initiatingBranch'),
    collectionBranch: this.cardRequestFormGroup.get('collectionBranch'),
    cardType: this.cardRequestFormGroup.get('cardType'),
  };
  sendCardRequestFormStatus = 'IDLE';

  ngOnInit(): void {
    this.dialogRef.afterOpened().subscribe(() => {
      if (this.data.caseDetail.cardRequestDetails?.accountToDebit ||
        this.data.caseDetail.moduleDetails?.accountNumber) {
        this.cardRequestFormGroupControls.accountToDebit.setValue(
          this.data.caseDetail.cardRequestDetails?.accountToDebit ||
          this.data.caseDetail.moduleDetails?.accountNumber
        );
      }
      if (this.data.caseDetail.cardRequestDetails?.preferredNameOnCard ||
        this.data.caseDetail.moduleDetails?.preferredNameOnCard) {
        this.cardRequestFormGroupControls.accountName.setValue(
          this.data.caseDetail.cardRequestDetails?.preferredNameOnCard ||
          this.data.caseDetail.moduleDetails?.preferredNameOnCard
        );
      }
      if (this.data.caseDetail.cardRequestDetails?.city) {
        this.cardRequestFormGroupControls.city.setValue(
          this.data.caseDetail.cardRequestDetails?.city
        );
      }
      if (this.data.caseDetail.cardRequestDetails?.customerTitle) {
        this.cardRequestFormGroupControls.customerTitle.setValue(
          this.data.caseDetail.cardRequestDetails?.customerTitle
        );
      }
      if (this.data.caseDetail.cardRequestDetails?.maritalStatus) {
        this.cardRequestFormGroupControls.maritalStatus.setValue(
          this.data.caseDetail.cardRequestDetails?.maritalStatus
        );
      }
      if (this.data.caseDetail.cardRequestDetails?.customerGender) {
        this.cardRequestFormGroupControls.customerGender.setValue(
          this.data.caseDetail.cardRequestDetails?.customerGender
        );
      }
      if (this.data.caseDetail.cardRequestDetails?.initiatingBranch) {
        this.cardRequestFormGroupControls.initiatingBranch.setValue(
          this.data.caseDetail.cardRequestDetails?.initiatingBranch
        );
      }
      if (this.data.caseDetail.cardRequestDetails?.collectionBranch) {
        this.cardRequestFormGroupControls.collectionBranch.setValue(
          this.data.caseDetail.cardRequestDetails?.collectionBranch
        );
      }
      if (this.data.caseDetail.cardRequestDetails?.cardType) {
        this.cardRequestFormGroupControls.cardType.setValue(
          this.data.caseDetail.cardRequestDetails?.cardType
        );
      }
    });
  }

  cardRequest(requestData: any): void {
    if (
      this.cardRequestFormGroup.status !== 'VALID' ||
      this.sendCardRequestFormStatus === 'PENDING'
    ) {
      return;
    }
    this.spinner.show();
    this.sendCardRequestFormStatus = 'PENDING';


    if (!this.cardRequestStatus) {
      this.customerRequestService.initiateCardRequest({
        accountNumber: this.data.caseDetail.accountNumber,
        city: requestData.city,
        customerTitle: requestData.customerTitle,
        maritalStatus: requestData.maritalStatus,
        customerGender: requestData.customerGender,
        initiatingBranch: requestData.initiatingBranch,
        collectionBranch: requestData.collectionBranch,
        cardType: requestData.cardType,
        preferredNameOnCard: requestData.preferredNameOnCard,
        accountToDebit: requestData.accountToDebit,
        initiatedBy:
          this.data.caseDetail.assignedBy || localStorage.getItem('userId'),
        approvedBy: localStorage.getItem('userId'),
        customerRequestTicketId: this.data.caseDetail.tranId,
      })
        .pipe(finalize(() => this.spinner.hide()))
        .subscribe(
          () => {
            this.sendCardRequestFormStatus = 'SUCCESS';
            this.cardRequestFormGroup.reset();
            this.cardRequestFormGroup.setErrors(null);
            Object.keys(this.cardRequestFormGroup.controls).forEach((key) => {
              this.cardRequestFormGroup.get(key).setErrors(null);
            });
            this.snackBar.open(
              'Card request initiated successfully'
            );
            this.dialogRef.close();
          },
          (error) => {
            this.sendCardRequestFormStatus = 'ERROR';
            this.snackBar.open(error);
          }
        );
    } else if (this.cardRequestStatus === 'INITIATED') {
      this.customerRequestService.approveCardRequest({
        accountNumber: this.data.caseDetail.accountNumber,
        city: requestData.city,
        customerTitle: requestData.customerTitle,
        maritalStatus: requestData.maritalStatus,
        customerGender: requestData.customerGender,
        initiatingBranch: requestData.initiatingBranch,
        collectionBranch: requestData.collectionBranch,
        cardType: requestData.cardType,
        preferredNameOnCard: requestData.preferredNameOnCard,
        accountToDebit: requestData.accountToDebit,
        initiatedBy:
          this.data.caseDetail.assignedBy || localStorage.getItem('userId'),
        approvedBy: localStorage.getItem('userId'),
        customerRequestTicketId: this.data.caseDetail.tranId,
      })
        .pipe(finalize(() => this.spinner.hide()))
        .subscribe(
          () => {
            this.sendCardRequestFormStatus = 'SUCCESS';
            this.cardRequestFormGroup.reset();
            this.cardRequestFormGroup.setErrors(null);
            Object.keys(this.cardRequestFormGroup.controls).forEach((key) => {
              this.cardRequestFormGroup.get(key).setErrors(null);
            });
            this.snackBar.open(
              'Card request approved successfully'
            );
            this.dialogRef.close(true);
          },
          (error) => {
            this.sendCardRequestFormStatus = 'ERROR';
            this.snackBar.open(error);
          }
        );
    }
  }
}
