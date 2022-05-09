import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { d3Module } from '../d3/d3.module';
import { D3Service } from '../d3/services/d3.service';
import { FilterService } from './Services/filter/filter.service';
import { NAS_APPPrimaryOutletPageComponent } from './NAS_APPPrimaryOutletPage.component'
import { SystemInventoryComponent } from './Tools/SystemInventory.component';
import { HRMProductionHistoryComponent } from './Hot_Mill/Production_Reports/HRMProductionHistory.component';
import { NASRoute } from './NAS_APP.routes'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee, faFilter, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { ViewModule } from '../ui/components/views/view.module';
import { FilerComponent } from './CommonComponents/filter.component';
import { ElementDefinitionFactoryService } from 'src/dataManagement/service/elementDefinitionFactoryService';
import { RouterModule } from '@angular/router';
import { MESComponent } from './MES/MES.component';
// Add an icon to the library for convenient access in other components
library.add(
  faCoffee
  , faFilter
  , faChevronDown);

@NgModule({
  imports: [
    CommonModule
    , FormsModule
    , ReactiveFormsModule
    , d3Module
    , NASRoute
    , ViewModule
    , FontAwesomeModule
    , RouterModule
  ],

  declarations: [
  //  NAS_APPPrimaryOutletPageComponent
     SystemInventoryComponent
    , HRMProductionHistoryComponent
    , FilerComponent
    , MESComponent
  ],
  exports: [
     d3Module],

  providers: [
    D3Service
    , FilterService
    , ElementDefinitionFactoryService
  ]
})

export class NAS_AppModule { }
