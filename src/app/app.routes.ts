import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  {
    path: 'NAS', loadChildren: '../NAS_App/NAS_App.module'
  }
];
export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
