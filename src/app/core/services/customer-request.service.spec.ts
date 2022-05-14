import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { CustomerRequestService } from './customer-request.service';

describe('CustomerRequestService', () => {
  let service: CustomerRequestService;

  afterEach(() => {
    TestBed.resetTestingModule();
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MatDialogModule],
    });
    service = TestBed.inject(CustomerRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
