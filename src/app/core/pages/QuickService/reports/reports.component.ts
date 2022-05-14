import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment.prod';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {
  selectedModule;
  quickServiceModules;
  constructor(
  ) { }

  ngOnInit(): void {
    this.quickServiceModules = environment.modules
  }
}
