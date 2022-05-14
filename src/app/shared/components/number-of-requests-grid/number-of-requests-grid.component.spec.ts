import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberOfRequestsGridComponent } from './number-of-requests-grid.component';

describe('NumberOfRequestsGridComponent', () => {
  let component: NumberOfRequestsGridComponent;
  let fixture: ComponentFixture<NumberOfRequestsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NumberOfRequestsGridComponent],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(NumberOfRequestsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
