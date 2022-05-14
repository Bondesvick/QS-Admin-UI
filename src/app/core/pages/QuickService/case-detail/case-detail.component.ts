import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModulePages } from 'src/app/core/models/Authenticate.Model/ITokenResponse';
import { CustomerRequestService } from 'src/app/core/services/customer-request.service';
import { saveAs } from 'file-saver';
import { DocumentViewDialogComponent } from 'src/app/core/components/document-view-dialog/document-view-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as JSZip from 'jszip';
import { parseCustomerRequest } from 'src/app/core/helpers/parseCustomerRequest';
import { CardRequestDialogComponent } from 'src/app/core/components/card-request-dialog/card-request-dialog.component';
import { AddressRequestDialogComponent } from 'src/app/core/components/address-request-dialog/address-request-dialog.component';
import { finalize } from 'rxjs/operators';
import { FacialIdentityRequestDialogComponent } from '../../../components/facial-identity-request-dialog/facial-identity-request-dialog.component';
import html2pdf from 'html2pdf.js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-case-detail',
  templateUrl: './case-detail.component.html'
})
export class CaseDetailComponent implements OnInit {
  get caseDetailKeys(): any[] {
    return Object.keys(this.moduleCustomerDetails);
  }

  constructor(
    private route: ActivatedRoute,
    private spinnerService: NgxSpinnerService,
    private customerRequestService: CustomerRequestService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isReportsRoute = event.url.includes('/reports/');
        console.log(this.isReportsRoute)
      }
    });
  }
  selectedModule: ModulePages;
  quickServiceModules: ModulePages[];

  caseDetail: any;

  moduleCustomerDocuments = [];
  moduleCustomerDetails = {};

  updateRequestFormGroup: FormGroup;
  updateRequestFormStatus = 'IDLE';
  isReportsRoute = false;

  ngOnInit(): void {
    this.updateRequestFormGroup = this.formBuilder.group({
      status: [null, [Validators.required]],
      userId: [null],
      remarks: [null, [Validators.required]],
      rejectionReason: [null],
      rejectionReasonOthers: [null],
    });

    this.quickServiceModules = !this.isReportsRoute ? JSON.parse(
      localStorage.getItem('quickServiceModules')
    ) : environment.modules;

    this.route.paramMap.subscribe((paramMap) => {
      const ticketId = paramMap.get('ticketId');
      const moduleType = paramMap.get('moduleLink');

      this.selectedModule = this.quickServiceModules?.find(
        (quickServiceModule) => {
          return quickServiceModule.link === moduleType;
        }
      );

      this.loadData(ticketId, moduleType);
    });
  }

  statusChanged(value): void {
    if (value === 'EXCEPTION') {
      this.updateRequestFormGroup.controls.rejectionReason.setValidators([
        Validators.required,
      ]);
    } else {
      this.updateRequestFormGroup.controls.rejectionReason.setValidators(null);
      this.updateRequestFormGroup.controls.rejectionReasonOthers.setValidators(
        null
      );
    }
    this.updateRequestFormGroup.controls.rejectionReason.updateValueAndValidity();
    this.updateRequestFormGroup.controls.rejectionReasonOthers.updateValueAndValidity();
  }
  rejectionReasonChanged(value): void {
    if (value === 'Others') {
      this.updateRequestFormGroup.controls.rejectionReasonOthers.setValidators([
        Validators.required,
      ]);
    } else {
      this.updateRequestFormGroup.controls.rejectionReasonOthers.setValidators(
        null
      );
    }
    this.updateRequestFormGroup.controls.rejectionReasonOthers.updateValueAndValidity();
  }

  removeCustomerRequestDocument(documentId): void {
    this.spinnerService.show();
    this.customerRequestService
      .deleteCustomerRequestDocument(this.caseDetail.tranId, documentId)
      .subscribe(
        () => {
          const caseDetail = JSON.parse(JSON.stringify(this.caseDetail));
          caseDetail.customerRequestDocuments = caseDetail.customerRequestDocuments.filter(
            (each) => each.id !== documentId
          );
          this.caseDetail = caseDetail;
        },
        () => { },
        () => {
          this.spinnerService.hide();
        }
      );
  }
  documentUploadComplete(data): void {
    // const caseDetail = JSON.parse(JSON.stringify(this.caseDetail));
    // caseDetail.customerRequestDocuments.push(data);
    // this.caseDetail = caseDetail;
    location.reload()
  }

  downloadDocument(data, name, type?): void {
    const url = `data:${type};base64,${data}`;
    saveAs(url, name);
  }
  openDocument(data, name, type): void {
    data = `data:${type};base64,${data}`;
    this.matDialog.open(DocumentViewDialogComponent, {
      data: {
        imageData: data,
        name,
        contentType: type,
      },
      height: '80vh',
      width: '80vw',
    });
  }
  openFacialIdentityRequestDialog(): void {
    this.matDialog.open(
      FacialIdentityRequestDialogComponent,
      {
        data: {
          caseDetail: this.caseDetail,
        },
      }
    );
  }
  openCardRequestDialog(): void {
    this.spinnerService.show();
    this.customerRequestService
      .getCardRequestDetails(this.caseDetail.accountNumber)
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe(
        (data) => {
          const cardRequestDialogRef = this.matDialog.open(
            CardRequestDialogComponent,
            {
              data: {
                cardRequestData: data,
                caseDetail: this.caseDetail,
              },
            }
          );

          cardRequestDialogRef.afterClosed().subscribe((response) => {
            if (response === true) {
              const caseDetail = JSON.parse(JSON.stringify(this.caseDetail));
              caseDetail.cardRequestDetails.status = 'SUCCESS';
              this.caseDetail = caseDetail;
            }
          });
        },
        (error) => {
          this.snackBar.open(error);
        }
      );
  }
  openAddressRequestDialog(): void {
    const addressRequestDialogRef = this.matDialog.open(
      AddressRequestDialogComponent,
      {
        data: {
          caseDetail: this.caseDetail,
        },
      }
    );

    addressRequestDialogRef.afterClosed().subscribe((response) => {
      if (response === true) {
        const caseDetail = JSON.parse(JSON.stringify(this.caseDetail));
        caseDetail.addressRequestDetails.status = 'SUCCESS';
        this.caseDetail = caseDetail;
      }
    });
  }

  async downloadAllDocuments(): Promise<void> {
    const zip = new JSZip();
    [
      ...this.moduleCustomerDocuments,
      ...(this.caseDetail?.customerRequestDocuments || []),
    ].forEach((document, index) => {
      if (document.documentFile) {
        const fullName =
          (document.documentFullName || document.documentFilename) +
          '-' +
          index +
          '.' +
          (document.documentContentType || document.documentType).split('/')[1];
        zip.file(fullName, document.documentFile, {
          base64: true,
        });
      }
    });
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'Customer-Uploaded-Documents.zip');
  }

  generatePdf(): void {
    const element = document.getElementById("pdf");

    var opt = {
      filename: this.caseDetail.accountName + ' ' + this.caseDetail.requestType + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      pagebreak: { mode: 'avoid-all' },
    };

    // New Promise-based usage:
    html2pdf().set(opt).from(element).save();
  }

  loadData(ticketId, moduleType): void {
    this.spinnerService.show();
    this.customerRequestService
      .getCustomerRequest({ ticketId, moduleType })
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe(
        (data) => {
          this.caseDetail = data;
          this.moduleCustomerDetails = parseCustomerRequest(data).details;
          this.moduleCustomerDocuments = parseCustomerRequest(data).documents;
        },
        () => { }
      );
  }
  updateRequest(updateRequestFormGroup: FormGroup): void {
    this.spinnerService.show();
    this.updateRequestFormStatus = 'PENDING';
    let patchData = [
      {
        op: 'replace',
        path: '/Status',
        value: updateRequestFormGroup.value.status,
      },
    ];
    if (
      updateRequestFormGroup.value.status === 'RESOLVED' ||
      updateRequestFormGroup.value.status === 'DECLINED' ||
      updateRequestFormGroup.value.status === 'EXCEPTION'
    ) {
      if (updateRequestFormGroup.value.status === 'EXCEPTION') {
        let reason;
        if (updateRequestFormGroup.value.rejectionReason === 'Others') {
          reason = updateRequestFormGroup.value.rejectionReasonOthers;
        } else {
          reason = updateRequestFormGroup.value.rejectionReason;
        }
        patchData = [
          ...patchData,
          {
            op: 'replace',
            path: '/RejectionReason',
            value: reason,
          },
        ];
      }
      patchData = [
        ...patchData,
        ...(updateRequestFormGroup.value.remarks && [
          {
            op: 'replace',
            path: '/Remarks',
            value: updateRequestFormGroup.value.remarks,
          },
        ]),
        {
          op: 'replace',
          path: '/TreatedBy',
          value: localStorage.getItem('userId'),
        },
      ];
    } else {
      patchData = [
        ...patchData,
        ...(updateRequestFormGroup.value.remarks && [
          {
            op: 'replace',
            path: '/Remarks',
            value: updateRequestFormGroup.value.remarks,
          },
        ]),
        {
          op: 'replace',
          path: '/AssignedTo',
          value:
            updateRequestFormGroup.value.userId ||
            localStorage.getItem('userId'),
        },
        {
          op: 'replace',
          path: '/AssignedBy',
          value: localStorage.getItem('userId'),
        },
      ];
    }

    this.customerRequestService
      .patchCustomerRequest(this.caseDetail.tranId, patchData)
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe(
        (data) => {
          this.updateRequestFormStatus = 'SUCCESS';
          this.caseDetail = data;

          updateRequestFormGroup.reset();
          updateRequestFormGroup.setErrors(null);
          Object.keys(updateRequestFormGroup.controls).forEach((key) => {
            updateRequestFormGroup.get(key).setErrors(null);
          });
          this.snackBar.open('Case updated successfully');
          location.reload()
        },
        () => {
          this.updateRequestFormStatus = 'ERROR';
        }
      );
  }
}
