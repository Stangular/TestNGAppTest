import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    //{ path: 'adadasd', loadChildren: '../NAS_App/NAS_App.module' },
    //{ path: 'Family', loadChildren: '../FamilyLineage/family-lineage.module' }
];
export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
