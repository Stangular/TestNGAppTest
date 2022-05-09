import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from 'src/models/navigation/navigationService';
import { NavigationLink } from 'src/models/navigation/navigationLink';


@Component({
  selector: 'site-map',
  templateUrl: './site-map.component.html'
})
export class SiteMapComponent implements OnInit {

  constructor(private _navMan: NavigationService,
    private router: Router) { }

  ngOnInit() {}


  JumpTo(link: NavigationLink) {
    this._navMan.Select(this.router, link, this._navMan.Home);
  }
}
