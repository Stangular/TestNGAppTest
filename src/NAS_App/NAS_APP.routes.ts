import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NAS_APPPrimaryOutletPageComponent } from './NAS_APPPrimaryOutletPage.component'
import { SystemInventoryComponent } from './Tools/SystemInventory.component';
import { HRMProductionHistoryComponent } from './Hot_Mill/Production_Reports/HRMProductionHistory.component';
import { LoginComponent } from '../app/login/login.component';
import { DetailViewComponent } from 'src/ui/components/views/detail/detail-view.component';
import { TableViewComponent } from 'src/ui/components/views/table/table-view.component';
import { HomeDefaultComponent } from 'src/app/home-default/home-default.component';
import { MESComponent } from './MES/MES.component';

const routes: Routes = [

  { path: 'hrmproductionhistory', component: HRMProductionHistoryComponent },
  { path: 'MES', component: MESComponent },
  {
    path: 'systeminventory', component: SystemInventoryComponent,
    children: [
      { path: 'detail/:sourceName', component: DetailViewComponent },
      { path: 'table/:sourceName', component: TableViewComponent }
    ]
  }
];


export const NASRoute: ModuleWithProviders = RouterModule.forChild(routes);
