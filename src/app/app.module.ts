import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { SpoolForCasesDialogComponent } from './core/components/spool-for-cases-dialog/spool-for-cases-dialog.component';
import { AssignCaseOwnerDialogComponent } from './core/components/assign-case-owner-dialog/assign-case-owner-dialog.component';
import { AppRoutingModule } from './app-routing.module';
import { CaseLayoutComponent } from './core/components/case-layout/case-layout.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NumberOfRequestsGridComponent } from './shared/components/number-of-requests-grid/number-of-requests-grid.component';
import { AccessDeniedComponent } from './core/pages/access-denied/access-denied.component';
import { AuthenticateComponent } from './core/pages/QuickService/authenticate/authenticate.component';
import { AuthLayoutComponent } from './core/components/auth-layout/auth-layout.component';
import { CaseDetailComponent } from './core/pages/QuickService/case-detail/case-detail.component';
import { CaseLogComponent } from './core/pages/QuickService/case-log/case-log.component';
import { AnonymousSearchComponent } from './core/pages/QuickService/anonymous-search/anonymous-search.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { JwtModule } from '@auth0/angular-jwt';
import { CaseDetailsDialogComponent } from './core/components/case-details-dialog/case-details-dialog.component';
import { UnauthenticatedErrorInterceptor } from './core/interceptors/unauthenticated-error.interceptor';
import { MaterialFileUploadComponent } from './core/components/material-file-upload/material-file-upload.component';
import { DocumentViewDialogComponent } from './core/components/document-view-dialog/document-view-dialog.component';
import { SafeUrlPipe } from './shared/pipes/safe-url.pipe';
import { MatTableExporterModule } from 'mat-table-exporter';
import { ModuleDetailsComponent } from './shared/components/module-details/module-details.component';
import { environment } from 'src/environments/environment';
import { AllReportsViewDialogComponent } from './core/components/all-reports-view-dialog/all-reports-view-dialog.component';
import { ReportsComponent } from './core/pages/QuickService/reports/reports.component';
import { CardRequestDialogComponent } from './core/components/card-request-dialog/card-request-dialog.component';
import { AddressRequestDialogComponent } from './core/components/address-request-dialog/address-request-dialog.component';
import { FacialIdentityRequestDialogComponent } from './core/components/facial-identity-request-dialog/facial-identity-request-dialog.component';
import { ExcelService } from './core/services/excel.service';

@NgModule({
  declarations: [
    AppComponent,
    CaseLogComponent,
    MaterialFileUploadComponent,
    SpoolForCasesDialogComponent,
    AssignCaseOwnerDialogComponent,
    CaseDetailComponent,
    CaseLayoutComponent,
    AnonymousSearchComponent,
    FooterComponent,
    NumberOfRequestsGridComponent,
    AccessDeniedComponent,
    AuthenticateComponent,
    AuthLayoutComponent,
    CaseDetailsDialogComponent,
    DocumentViewDialogComponent,
    SafeUrlPipe,
    ModuleDetailsComponent,
    AllReportsViewDialogComponent,
    ReportsComponent,
    CardRequestDialogComponent,
    AddressRequestDialogComponent,
    FacialIdentityRequestDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatIconModule,
    HttpClientModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatDividerModule,
    MatTableModule,
    MatListModule,
    MatSidenavModule,
    MatSortModule,
    AppRoutingModule,
    NgxSpinnerModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('authorization'),
        allowedDomains: [environment.baseURIHost],
      },
    }),
    MatTableExporterModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    SpoolForCasesDialogComponent,
    AssignCaseOwnerDialogComponent,
    CaseDetailsDialogComponent,
    CardRequestDialogComponent,
    AddressRequestDialogComponent
  ],
  providers: [
    ExcelService,
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 5000,
        verticalPosition: 'top',
      },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthenticatedErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
