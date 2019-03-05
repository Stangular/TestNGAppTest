import { Component, AfterContentInit } from '@angular/core';
//import { AppDataService } from '../dataManagement/service/appData.service';
//import * as d3 from "d3";
//import './app.component.scss';
//import '../style/app.scss';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterContentInit {
  title = 'TestNGApp2';
  //constructor(public appDataService: AppDataService) {
  //  appDataService.PromiseLoad();
  //}
  constructor() {
    let sss = 0;
  }
  ngAfterContentInit() {


  }
}
