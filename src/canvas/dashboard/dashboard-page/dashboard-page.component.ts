import { Component, OnInit, Input } from '@angular/core';
import { LayoutService } from 'src/app/services/layout/layout-service.service';
import { Records } from 'src/dataManagement/model/records';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {

  layoutIndex: number = -1;
  @Input() layoutName: string = 'base';
  @Input() source: Records<string>;

  constructor(public layout: LayoutService) { }
 

  ngOnInit() {
    this.layoutIndex = this.layout.getPatternIndex(this.layoutName);
  }

}
