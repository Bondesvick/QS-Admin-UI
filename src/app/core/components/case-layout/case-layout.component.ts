import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-case-layout',
  templateUrl: './case-layout.component.html'
})
export class CaseLayoutComponent implements OnInit {
  @Input() title = 'Title Here';
  @Input() subtitle = 'View and process cases';

  ngOnInit(): void {}
}
