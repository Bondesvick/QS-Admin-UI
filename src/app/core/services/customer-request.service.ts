import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { retry, catchError, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerRequestService {
  apiURL = environment.baseURI;

  constructor(private httpClient: HttpClient) { }

  getCustomerRequest(params): Observable<any> {
    return this.httpClient
      .get<any>(this.apiURL + 'CustomerRequest/GetCustomerRequest', {
        params: {
          TicketId: params.ticketId,
          Module: params.moduleType,
        },
      })
      .pipe(
        retry(3),
        switchMap(this.handleResponse),
        catchError(this.handleError)
      );
  }

  getCardRequestDetails(accountNumber: string): Observable<any> {
    return this.httpClient
      .get<any>(this.apiURL + 'CardRequest/CardRequestDetails', {
        params: {
          accountNumber,
        },
      })
      .pipe(
        retry(3),
        switchMap(this.handleResponse),
        catchError(this.handleError)
      );
  }

  getAddressRequestDetails(): Observable<any> {
    return this.httpClient
      .get<any>(this.apiURL + 'AddressRequest/AddressRequestDetails')
      .pipe(
        retry(3),
        switchMap(this.handleResponse),
        catchError(this.handleError)
      );
  }

  getCustomerRequestAsPdf(params): Observable<Blob> {
    return this.httpClient
      .get(this.apiURL + 'CustomerRequest/GetCustomerRequestAsPdf', {
        params: {
          TicketId: params.ticketId,
          Module: params.moduleType,
        },
        responseType: 'blob',
      })
      .pipe(retry(3), catchError(this.handleError));
  }

  deleteCustomerRequestDocument(ticketId, documentId): Observable<any> {
    return this.httpClient
      .delete<any>(
        this.apiURL +
        'CustomerRequest/' +
        ticketId +
        '/CustomerRequestDocument/' +
        documentId
      )
      .pipe(
        retry(3),
        switchMap(this.handleResponse),
        catchError(this.handleError)
      );
  }

  patchCustomerRequest(caseId, patchDocument): Observable<any> {
    return this.httpClient
      .patch<any>(this.apiURL + 'CustomerRequest/' + caseId, patchDocument)
      .pipe(switchMap(this.handleResponse), catchError(this.handleError));
  }

  assignCustomerRequest(caseId, payload): Observable<any> {
    return this.httpClient
      .post<any>(this.apiURL + 'CustomerRequest/' + caseId + '/AssignCustomerRequest', payload)
      .pipe(switchMap(this.handleResponse), catchError(this.handleError));
  }

  treatCustomerRequest(caseId, payload): Observable<any> {
    return this.httpClient
      .post<any>(this.apiURL + 'CustomerRequest/' + caseId + '/TreatCustomerRequest', payload)
      .pipe(switchMap(this.handleResponse), catchError(this.handleError));
  }

  approveCardRequest(cardRequestDetails: any): Observable<any> {
    return this.httpClient
      .post<any>(this.apiURL + 'CardRequest/Approve', cardRequestDetails)
      .pipe(switchMap(this.handleResponse), catchError(this.handleError));
  }

  initiateCardRequest(cardRequestDetails: any): Observable<any> {
    return this.httpClient
      .post<any>(this.apiURL + 'CardRequest/Initiate', cardRequestDetails)
      .pipe(switchMap(this.handleResponse), catchError(this.handleError));
  }

  approveAddressRequest(addressRequestDetails: any): Observable<any> {
    return this.httpClient
      .post<any>(this.apiURL + 'AddressRequest/Approve', addressRequestDetails)
      .pipe(switchMap(this.handleResponse), catchError(this.handleError));
  }

  initiateAddressRequest(addressRequestDetails: any): Observable<any> {
    return this.httpClient
      .post<any>(this.apiURL + 'AddressRequest/Initiate', addressRequestDetails)
      .pipe(switchMap(this.handleResponse), catchError(this.handleError));
  }

  approveFacialIdentityRequest(facialIdentityRequestDetails: any): Observable<any> {
    return this.httpClient
      .post<any>(this.apiURL + 'FacialIdentityRequest/Approve', facialIdentityRequestDetails)
      .pipe(switchMap(this.handleResponse), catchError(this.handleError));
  }

  initiateFacialIdentityRequest(facialIdentityRequestDetails: any): Observable<any> {
    return this.httpClient
      .post<any>(this.apiURL + 'FacialIdentityRequest/Initiate', facialIdentityRequestDetails)
      .pipe(switchMap(this.handleResponse), catchError(this.handleError));
  }

  getDashboardCustomerRequests(params: any): Observable<any> {
    return this.httpClient
      .get<any>(
        this.apiURL + 'CustomerRequest/GetAllDashboardCustomerRequests',
        { params }
      )
      .pipe(
        retry(3),
        switchMap(this.handleResponse),
        catchError(this.handleError)
      );
  }
  getCustomerRequests(params): Observable<any> {
    return this.httpClient
      .get<any>(this.apiURL + 'CustomerRequest/GetAllCustomerRequests', {
        params,
      })
      .pipe(
        retry(3),
        switchMap(this.handleResponse),
        catchError(this.handleError)
      );
  }

  handleResponse(res): Observable<any> {
    if (res.responseCode === '00') {
      return of(res.data);
    } else {
      const errorMessage = res.responseDescription;
      throw new Error(errorMessage);
    }
  }
  // Error handling
  handleError(error): Observable<never> {
    let errorMessage = error;
    if (error.status < 500 && error.status >= 400) {
      errorMessage = 'Bad request';
    } else if (error.status >= 500) {
      errorMessage = 'Something went wrong';
    }
    return throwError(errorMessage);
  }
}
