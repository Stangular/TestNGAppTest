import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeDefaultComponent } from './home-default/home-default.component';
import { NAS_APPPrimaryOutletPageComponent } from 'src/NAS_App/NAS_APPPrimaryOutletPage.component';
import { LoginComponent } from './login/login.component';
import { LostCauseComponent } from 'src/apps/LostCauseAnalysis/LostCause.component';
import { SiteMapComponent } from './common/site-map/site-map.component';

export const routes: Routes = [
  {
    path: '', component: HomeDefaultComponent,
    children: [
      {
        path: 'home', component: HomeDefaultComponent
      }
    ]
  }
  , {
    path: 'SiteMap', component: SiteMapComponent
  }
  , {
    path: 'NAS', component: NAS_APPPrimaryOutletPageComponent
  }
  , {
    path: 'Lost_Cause', component: LostCauseComponent
  },
  {
    path: 'login', component: LoginComponent
  }
  //{ path: 'adadasd', loadChildren: '../NAS_App/NAS_App.module' },
  //{ path: 'Family', loadChildren: '../FamilyLineage/family-lineage.module' }
];
export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
