import { NgModule } from '@angular/core';
import { LostCauseComponent } from './LostCause.component';
import { FilterService } from './filters/filter.service';
import { ElementDefinitionFactoryService } from 'src/dataManagement/service/elementDefinitionFactoryService';
import { NavigationService } from 'src/models/navigation/navigationService';

import { Routes, RouterModule } from '@angular/router';
import { LCRoute } from './LostCause.routes';
import { LCPeopleComponent } from './components/people/lc_people.component';
import { LCStatesComponent } from './components/states/lc_states.component';
import { ViewModule } from 'src/ui/components/views/view.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
//import { NavMenuComponent } from 'src/app/navigation/navmenu.component';
// Add an icon to the library for convenient access in other components


@NgModule({
  imports: [
    CommonModule
    , FormsModule
    , ReactiveFormsModule
    , RouterModule
    , ViewModule
    , LCRoute],

  declarations: [
     LCPeopleComponent
    , LCStatesComponent
  ],
  exports: [],

  providers: [
    ElementDefinitionFactoryService
    , NavigationService
    , FilterService
  ]
})

export class LostCause_AppModule { }
