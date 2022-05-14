import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ITokenResponse } from 'src/app/core/models/Authenticate.Model/ITokenResponse';
import { AuthenticateService } from 'src/app/core/services/authenticate.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html'
})
export class AuthenticateComponent implements OnInit {
  response: any;
  username: string;
  useremail: string;
  serviceResponse: ITokenResponse;
  branch: string;
  branchId: string;
  uamResponse: string;
  userId: string;
  authToken: string;
  callerUrl: string;

  constructor(
    private router: Router,
    private authenticate: AuthenticateService,
    private snackbar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.uamResponse = atob(params['xfyuy'] || btoa(null));
      this.userId = atob(params['xzerwq'] || btoa(null));
      this.authToken = atob(params['yohgcx'] || btoa(null));
      this.callerUrl = atob(params['kjyfcx'] || btoa(null));

      localStorage.setItem('response', this.uamResponse);
      localStorage.setItem('userId', this.userId);
      localStorage.setItem('authorization', this.authToken);
      localStorage.setItem('callerUrl', this.callerUrl.replace('hash', '#'));

      if (
        this.uamResponse === 'null' ||
        this.userId === 'null' ||
        this.authToken === 'null' ||
        this.callerUrl === 'null'
      ) {
        this.snackbar.open(
          'Something went wrong! Please revalidate by logging into the system again'
        );
      } else {
        this.serviceResponse = JSON.parse(localStorage.getItem('response'));
        this.branch = this.serviceResponse?.body.detail.branch;
        this.branchId = this.serviceResponse?.body.detail.branchId;
        this.username = this.serviceResponse?.body.detail.name;
        this.useremail = this.serviceResponse?.body.detail.email;
        localStorage.setItem('name', this.username);
        localStorage.setItem('email', this.useremail);
        localStorage.setItem('branch', this.branch);
        localStorage.setItem('branchId', this.branchId);
        this.LoadComponent('QuickService/anonymous-search');
      }
    });
  }

  LoadComponent(componentName) {
    localStorage.setItem('Modulename', componentName);
    const staffId = localStorage.getItem('userId');
    this.onAuthenticateQuickService(staffId, componentName);
  }

  onAuthenticateQuickService(staffId: string, component: string) {
    this.spinner.show();
    this.authenticate.quickServiceTokenAuthorization(staffId).subscribe(
      async (response) => {
        const res = response.data?.newToken;
        if (response.responseCode === '00' && res != null) {
          localStorage.setItem('authorization', res);
          this.spinner.hide();
          await this.router.navigate([component]);
        } else {
          this.spinner.hide();
          this.snackbar.open(
            'Something went wrong! Please revalidate by logging into the system again'
          );
        }
      },
      () => {
        this.spinner.hide();
        this.snackbar.open(
          'Something went wrong. Please ensure you are connected'
        );
      }
    );
  }
}
