import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NAS_APPPrimaryOutletPageComponent } from './NAS_APPPrimaryOutletPage.component'
import { SystemInventoryComponent } from './Tools/SystemInventory.component';
import { HRMProductionHistoryComponent } from './Hot_Mill/Production_Reports/HRMProductionHistory.component';

const routes: Routes = [
  {
    path: '', component: NAS_APPPrimaryOutletPageComponent,
    children: [
      { path: 'hrmproductionhistory', component: HRMProductionHistoryComponent },
      { path: 'systeminventory', component: SystemInventoryComponent }
    ]

  }
];


export const NASRoute: ModuleWithProviders = RouterModule.forChild(routes);
