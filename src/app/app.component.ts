import { Component, HostListener, AfterContentInit, OnInit } from '@angular/core';
import { LayoutService } from './services/layout/layout-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterContentInit, OnInit {
  title = 'TestNGApp2';
 
  constructor(private layout: LayoutService) {
    let sss = 0;
  }
  ngAfterContentInit() {


  }

  ngOnInit() {
    this.layout.Layout.SetWindowWidth(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.layout.Layout.SetWindowWidth(window.innerWidth);
  }
}
