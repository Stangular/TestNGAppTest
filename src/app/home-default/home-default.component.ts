import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from 'src/models/navigation/navigationService';

@Component({
  selector: 'app-home-default',
  templateUrl: './home-default.component.html',
  styleUrls: ['./home-default.component.css']
})
export class HomeDefaultComponent implements OnInit {

  constructor(private _navMan: NavigationService,
    private router: Router) { }

  ngOnInit() {
    this._navMan.Select(this.router, this._navMan.Home);

  }

}
