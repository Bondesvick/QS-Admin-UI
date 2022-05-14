import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { AccessDeniedComponent } from './core/pages/access-denied/access-denied.component';
import { AuthenticateComponent } from './core/pages/QuickService/authenticate/authenticate.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthLayoutComponent } from './core/components/auth-layout/auth-layout.component';
import { CaseDetailComponent } from './core/pages/QuickService/case-detail/case-detail.component';
import { CaseLogComponent } from './core/pages/QuickService/case-log/case-log.component';
import { AnonymousSearchComponent } from './core/pages/QuickService/anonymous-search/anonymous-search.component';
import { ReportsComponent } from './core/pages/QuickService/reports/reports.component';

const routes: Routes = [
  // {
  //   path: 'detail',
  //   component: CaseDetailComponent,
  // },

  // {
  //   path: 'detail2',
  //   component: CaseLogComponent,
  // },
  
  {
    path: 'Authenticate',
    component: AuthenticateComponent,
  },
  {
    path: 'QuickService',
    component: AuthLayoutComponent,
   // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        //canActivateChild: [AuthGuard],
        children: [
          {
            path: 'anonymous-search',
            component: AnonymousSearchComponent,
          },
          {
            path: 'reports',
            component: ReportsComponent,
          },
          {
            path: 'reports/:moduleLink/:ticketId',
            component: CaseDetailComponent,
          },
          {
            path: 'reports/:moduleLink',
            component: CaseLogComponent,
          },
          {
            path: ':moduleLink',
            component: CaseLogComponent,
          },
          {
            path: ':moduleLink/:ticketId',
            component: CaseDetailComponent,
          },
        ],
      },
    ],
  },
  // { path: '', redirectTo: '/anonymous-search', pathMatch: 'full' }, // redirect to `first-component`
  {
    path: '**',
    component: AccessDeniedComponent,
  },
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      //useHash: true,
      //relativeLinkResolution: 'legacy',
    }),

    //RouterModule.forRoot(routes)
  ],
  //providers: [AuthGuard],

  providers: [AuthGuard],
  exports: [RouterModule],
})
export class AppRoutingModule { }
