import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-number-of-requests-grid',
  templateUrl: './number-of-requests-grid.component.html',
})
export class NumberOfRequestsGridComponent implements OnInit {
  @Input() numberOfTotalRequests = 0;
  @Input() numberOfPendingRequests = 0;
  @Input() numberOfAssignedToMeRequests = 0;
  @Input() numberOfAssignedToOthersRequests = 0;

  @Output() showRequestsEvent = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  showRequests(type: string) {
    this.showRequestsEvent.emit(type);
  }
}
