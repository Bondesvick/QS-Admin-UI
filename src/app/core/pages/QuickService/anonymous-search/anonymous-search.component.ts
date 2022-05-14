import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { CaseDetailsDialogComponent } from 'src/app/core/components/case-details-dialog/case-details-dialog.component';
import { CustomerRequestService } from 'src/app/core/services/customer-request.service';

@Component({
  selector: 'app-anonymous-search',
  templateUrl: './anonymous-search.component.html',
  host: { class: 'flex-grow flex flex-col' },
})
export class AnonymousSearchComponent implements OnInit {
  searchTypes: searchType[] = [
    {
      searchType: 'ticketId',
      searchTitle: 'Ticket ID',
      searchSubtitle: 'Filter your search results by ticket ID',
    },
    {
      searchType: 'accountNumber',
      searchTitle: 'Account Number',
      searchSubtitle: 'Filter your search results by account number',
    },
    {
      searchType: 'bvn',
      searchTitle: 'Bank Verification Number (BVN)',
      searchSubtitle: 'Filter your search results by BVN',
    },
  ];

  searchTypeFormGroup = this._fb.group({
    selectedSearchType: [this.searchTypes[0].searchType],
  });
  searchTypeIdentityValueFormGroup = this._fb.group({
    searchTypeIdentityValue: ['', [Validators.required]],
  });

  @ViewChild('table') resultsTable: MatTable<any>;

  constructor(
    private _fb: FormBuilder,
    private _customerRequestService: CustomerRequestService,
    private _spinner: NgxSpinnerService,
    private _dialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.searchTypeFormGroup.valueChanges.subscribe(() => {
      this.dataSource = [];
      this.searchTypeIdentityValueFormGroup.reset();
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

  openDetailDialog(index: number) {
    const selectedRow = this.dataSource[index];
    this._dialog.open(CaseDetailsDialogComponent, {
      data: selectedRow,
    });
  }

  displayedColumns: string[] = [
    'tranId',
    'accountName',
    'accountNumber',
    'bvn',
    'createdDate',
    'requestType',
    'status',
    'action',
  ];

  dataSource = [];

  getCustomerRequests(searchType, identityNumber) {
    this._spinner.show();
    this._customerRequestService
      .getCustomerRequests({ [searchType]: identityNumber })
      .pipe(finalize(() => this._spinner.hide()))
      .subscribe(
        (data) => {
          this.dataSource = data;
          this.resultsTable.renderRows();
        },
        () => { }
      );
  }
  // dataSource = ELEMENT_DATA;
  sortInfo: {
    active: string;
    direction: string;
  };

  get selectedSearchType() {
    return this.searchTypes.find(
      (searchType) =>
        searchType.searchType ===
        this.searchTypeFormGroup.value.selectedSearchType
    );
  }
}
interface searchType {
  searchType: string;
  searchTitle: string;
  searchSubtitle: string;
}
