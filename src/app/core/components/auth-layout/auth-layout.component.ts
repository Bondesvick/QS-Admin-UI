import { Component, OnInit } from '@angular/core';
import {
  ITokenResponse,
  ModulePages,
} from '../../models/Authenticate.Model/ITokenResponse';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent implements OnInit {
  staffname: string;
  staffemail: string;
  serviceResponse: ITokenResponse;
  response: any;
  res: string;
  component: string;
  branch: string;
  quickServiceModules: ModulePages[];

  constructor() {}

  ngOnInit(): void {
    this.staffname = localStorage.getItem('name');
    this.staffemail = localStorage.getItem('email');
    this.component = localStorage.getItem('Modulename');
    this.branch = localStorage.getItem('branch');
    this.serviceResponse = JSON.parse(localStorage.getItem('response'));
    this.quickServiceModules = [
      ...QUICK_SERVICE_MODULES,
      ...this.getPageMenus(this.serviceResponse),
    ];
    localStorage.setItem(
      'quickServiceModules',
      JSON.stringify(this.quickServiceModules)
    );
  }

  get goBackUrl() {
    return localStorage.getItem('callerUrl');
  }

  private getPageMenus(res: ITokenResponse): ModulePages[] | any[] {
    const targetModule = res?.body.modules.find(
      (m) => m.name === this.component.split('/')[0]
    );
    if (targetModule) {
      return targetModule.modulePages.filter(
        (page) => !page.name.includes('Module')
      );
    }
    return [];
  }
}

export const QUICK_SERVICE_MODULES: ModulePages[] = [
  {
    name: 'Anonymous Search',
    role: '',
    url: '',
    link: '/QuickService/anonymous-search',
  }
];
