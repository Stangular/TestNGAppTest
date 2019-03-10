import { Component, AfterContentInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterContentInit {
  title = 'TestNGApp2';
 
  constructor() {
    let sss = 0;
  }
  ngAfterContentInit() {


  }
}
