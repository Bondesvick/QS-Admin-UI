import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllReportsViewDialogComponent } from './all-reports-view-dialog.component';

describe('AllReportsViewDialogComponent', () => {
  let component: AllReportsViewDialogComponent;
  let fixture: ComponentFixture<AllReportsViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllReportsViewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllReportsViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
