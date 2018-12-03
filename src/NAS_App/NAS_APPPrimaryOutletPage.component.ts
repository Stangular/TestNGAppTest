import { Component, OnInit, Inject } from '@angular/core';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
//import { filter } from '@fortawesome/fontawesome-free-solid';
import { FilterService } from './Services/filter/filter.service';


@Component({
  templateUrl: './NAS_APPPrimaryOutletPage.component.html',
  styleUrls: ['./NAS_APP.css']
})
export class NAS_APPPrimaryOutletPageComponent implements OnInit {
  constructor(private filterService: FilterService) { }
  pageTitle: string = 'Page Title';

  ngOnInit() {
  }
}
