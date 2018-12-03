import { Component, OnInit } from '@angular/core';
import { FilterService } from '../Services/filter/filter.service';
//import { FilterModel } from '../Services/filter/filter.model';

@Component({
  selector: 'filter_component',
  templateUrl: './project.component.html'
})
export class ProjectComponent implements OnInit {


  constructor( public filterService: FilterService) { }

  ngOnInit() {
  }
}
