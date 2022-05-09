import { Component } from '@angular/core';
import { FilterService } from 'src/NAS_App/Services/filter/filter.service';
import { UserService } from 'src/app/user/service/app-user.service';
import { NavigationService } from 'src/models/navigation/navigationService';
import { NavigationLink } from 'src/models/navigation/navigationLink';

@Component({

  selector: 'lc-sss',
  templateUrl: './LostCause.component.html',
  styleUrls: ['./LostCause.component.css']
})
export class LostCauseComponent {
  rowdata: number[] = [1, 2, 3, 4, 6, 7, 8];

  constructor(private filterService: FilterService
    , public userService: UserService
    , private navService: NavigationService) {


    //this.navService.AddTo(new NavigationLink('People', '', '/people'), 'Lost Cause');
    //this.navService.AddTo(new NavigationLink('States', '', '/states'), 'Lost Cause');
    //this.navService.AddTo(new NavigationLink('Person', 'view_compact', '/people/detail', 'lc_people'), 'People');
    //this.navService.AddTo(new NavigationLink('All', 'grid_on', '/people/table', 'lc_people'), 'People');
    //this.navService.AddTo(new NavigationLink('State Detail', 'view_compact', '/states/detail', 'lc_states'), 'States');
    //this.navService.AddTo(new NavigationLink('State Table', 'grid_on', '/states/table', 'lc_states'), 'States');

  }
  
}
