import { Component, OnInit } from '@angular/core';
import { FilterService } from '../Services/filter/filter.service';
//import { FilterModel } from '../Services/filter/filter.model';

@Component({
  selector: 'filter_component',
  templateUrl: './filter.component.html'
})
export class FilerComponent implements OnInit {


  constructor( public filterService: FilterService) { }

  ngOnInit() {
  }
}
