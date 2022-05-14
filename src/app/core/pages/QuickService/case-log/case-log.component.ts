import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { AssignCaseOwnerDialogComponent } from 'src/app/core/components/assign-case-owner-dialog/assign-case-owner-dialog.component';
import { SpoolForCasesDialogComponent } from 'src/app/core/components/spool-for-cases-dialog/spool-for-cases-dialog.component';
import { ModulePages } from 'src/app/core/models/Authenticate.Model/ITokenResponse';
import { CustomerRequestService } from 'src/app/core/services/customer-request.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { environment } from '../../../../../environments/environment.prod';

@Component({
  selector: 'app-case-log',
  templateUrl: './case-log.component.html'
})
export class CaseLogComponent implements OnInit {
  selectedModule: ModulePages;
  quickServiceModules: ModulePages[];

  tableState: {
    page?: number;
    limit?: number;
    module: string;
    startDate?: string;
    endDate?: string;
    accountNumber?: string;
    phoneNumber?: string;
    bvn?: string;
    ticketId?: string;
  };

  @ViewChild('table') resultsTable: MatTable<any>;

  isReportsRoute = false;

  constructor(
    private _dialog: MatDialog,
    private _route: ActivatedRoute,
    private _customerRequestService: CustomerRequestService,
    private _spinner: NgxSpinnerService,
    private router: Router,
    private excelService: ExcelService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isReportsRoute = event.url.includes('/reports/');
      }
    });
  }

  ngOnInit(): void {
    this.quickServiceModules = !this.isReportsRoute ? JSON.parse(
      localStorage.getItem('quickServiceModules')
    ) : environment.modules;

    this._route.paramMap.subscribe((paramMap) => {
      this.selectedModule = this.quickServiceModules?.find(
        (quickServiceModule) => {
          return quickServiceModule?.link.includes(paramMap.get('moduleLink'));
        }
      );

      // this.loadData({
      //   module: this.selectedModule?.link,
      // });
      this.loadData({
        module: this.selectedModule?.link,
      });
    });
  }

  formatStatus(value: string) {
    value = value + '';
    return value
      .toLowerCase()
      .split('-')
      .map((each) => each[0].toUpperCase() + each.slice(1))
      .join(' ');
  }
  loadData(params) {
    this._spinner.show();
    this._customerRequestService
      .getDashboardCustomerRequests(params)
      .pipe(finalize(() => this._spinner.hide()))
      .subscribe(
        (data) => {
          this.tableState = params;
          this.totalDataSource = data;
          this.dataSource = this.totalDataSource;
          this.resultsTable.renderRows();
        },
        () => { }
      );
  }
  get pendingRequests() {
    return this.totalDataSource.filter((each) => each.status === 'PENDING');
  }

  get assignedToMeRequests() {
    return this.totalDataSource.filter(
      (each) => each.assignedTo === localStorage.getItem('userId')
    );
  }
  get assignedToOthersRequests() {
    return this.totalDataSource.filter(
      (each) =>
        each.assignedTo && each.assignedTo !== localStorage.getItem('userId')
    );
  }

  showRequests(type: string) {
    switch (type) {
      case 'all':
        this.dataSource = this.totalDataSource;
        break;
      case 'pending':
        this.dataSource = this.pendingRequests;
        break;
      case 'assignedToMe':
        this.dataSource = this.assignedToMeRequests;
        break;
      case 'assignedToOthers':
        this.dataSource = this.assignedToOthersRequests;
        break;
      default:
        return;
    }
  }

  openSpoolForCasesDialog() {
    let _dialogRef = this._dialog.open(SpoolForCasesDialogComponent, {
      data: this.selectedModule
    });

    _dialogRef.afterClosed().subscribe((data) => {
      if (data?.data) {
        this.dataSource = data.data;
      }
      if (data?.module) {
        this.spoolModule = data.module
      }
    });
  }

  filterByCaseIdInput(caseId) {
    this.dataSource = this.totalDataSource.filter((each) => {
      return each.tranId?.toLowerCase().includes(caseId.toLowerCase());
    });
  }

  openAssignCaseOwnerDialog(tranId) {
    let _dialogRef = this._dialog.open(AssignCaseOwnerDialogComponent, {
      minWidth: '30%',
      data: { tranId },
    });

    _dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.loadData(this.tableState);
      }
    });
  }

  exportAsXLSX():void {

    if(this.dataSource.length < 1){
      alert("No data to export!")
      return;
    }
    this.excelService.exportAsExcelFile(this.dataSource, 'Customer Requests');
 }

  displayedColumns: string[] = [
    'tranId',
    'accountName',
    'accountNumber',
    'bvn',
    'createdDate',
    'assignedTo',
    'status',
    'remarks',
    'action',
  ];

  dataSource = [];
  totalDataSource = [];
  spoolModule = null;

  sortInfo: {
    active: string;
    direction: string;
  };
}
