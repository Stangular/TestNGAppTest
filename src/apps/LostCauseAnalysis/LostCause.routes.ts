import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LCPeopleComponent } from './components/people/lc_people.component';
import { LCStatesComponent } from './components/states/lc_states.component';
import { DetailViewComponent } from 'src/ui/components/views/detail/detail-view.component';
import { TableViewComponent } from 'src/ui/components/views/table/table-view.component';
//import { NAS_APPPrimaryOutletPageComponent } from './NAS_APPPrimaryOutletPage.component'
//import { SystemInventoryComponent } from './Tools/SystemInventory.component';
//import { HRMProductionHistoryComponent } from './Hot_Mill/Production_Reports/HRMProductionHistory.component';
//import { LoginComponent } from '../app/login/login.component';
//import { DetailViewComponent } from 'src/ui/components/views/detail/detail-view.component';
//import { TableViewComponent } from 'src/ui/components/views/table/table-view.component';
//import { HomeDefaultComponent } from 'src/app/home-default/home-default.component';
const routes: Routes = [
  {
    path: 'people', component: LCPeopleComponent,
    children: [
      { path: 'detail/:sourceName', component: DetailViewComponent },
      { path: 'table/:sourceName', component: TableViewComponent }
    ]
  }
  ,
  {
    path: 'states', component: LCStatesComponent,
    children: [
      { path: 'detail/:sourceName', component: DetailViewComponent },
      { path: 'table/:sourceName', component: TableViewComponent }
    ]
  }
];
export const LCRoute: ModuleWithProviders = RouterModule.forChild(routes);
