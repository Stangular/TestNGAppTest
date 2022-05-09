import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from 'src/models/navigation/navigationService';
import { NavigationLink } from 'src/models/navigation/navigationLink';
import { UserService } from '../user/service/app-user.service';

@Component({
  selector: 'nav-menu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavMenuComponent implements OnInit {

  constructor(private _navMan: NavigationService,
    private router: Router
    , public userService: UserService) {

    this._navMan.AddTo(new NavigationLink('MES', '', '/MES'), 'NAS');
    this._navMan.AddTo(new NavigationLink('HR', '', '/hrmproductionhistory'), 'NAS');
    this._navMan.AddTo(new NavigationLink('Employee Swipes Report'), 'HR');
    this._navMan.AddTo(new NavigationLink('Hot Mill'), 'MES');
    this._navMan.AddTo(new NavigationLink('Production Reports'), 'Hot Mill');
    this._navMan.AddTo(new NavigationLink('HRM Production History'), 'Production Reports');
    this._navMan.AddTo(new NavigationLink('Tools', '', '/systeminventory/detail', 'VBarChart'), 'MES');
    this._navMan.AddTo(new NavigationLink('System Inventory', '', '/systeminventory/detail', 'VBarChart'), 'Tools');
    this._navMan.AddTo(new NavigationLink('VBar Detail', 'view_compact', '/systeminventory/detail', 'VBarChart'), 'System Inventory');
    this._navMan.AddTo(new NavigationLink('VBar Table', 'grid_on', '/systeminventory/table', 'VBarChart'), 'System Inventory');

    this._navMan.AddTo(new NavigationLink('People', '', '/people'), 'Lost Cause');
    this._navMan.AddTo(new NavigationLink('States', '', '/states'), 'Lost Cause');
    this._navMan.AddTo(new NavigationLink('Person', 'view_compact', '/people/detail', 'lc_people'), 'People');
    this._navMan.AddTo(new NavigationLink('All', 'grid_on', '/people/table', 'lc_people'), 'People');
    this._navMan.AddTo(new NavigationLink('State Detail', 'view_compact', '/states/detail', 'lc_states'), 'States');
    this._navMan.AddTo(new NavigationLink('State Table', 'grid_on', '/states/table', 'lc_states'), 'States');
 }

  ngOnInit() {
   // this._navMan.SelectedItem.Go(this.router);
  }

  RouteBack() {
    
    this._navMan.Back(this.router);
  }

  RouteTo(link: NavigationLink) {
    this._navMan.Select(this.router,link);
  }

  JumpTo(link: NavigationLink) {
    this._navMan.Select(this.router, link, this._navMan.Home);
  }
}
