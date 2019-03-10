import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ngMaterialModule } from '../ui/module/ngMaterialUI.module';
import { d3Module } from '../d3/d3.module';
//import { OlMapComponent } from '../maps/openlayers/olMap.component'
import { D3Service } from '../d3/services/d3.service';
import { FilterService } from './Services/filter/filter.service';
import { NAS_APPPrimaryOutletPageComponent } from './NAS_APPPrimaryOutletPage.component'
import { SystemInventoryComponent } from './Tools/SystemInventory.component';
import { HRMProductionHistoryComponent } from './Hot_Mill/Production_Reports/HRMProductionHistory.component';
import { NASRoute } from './NAS_APP.routes'
import { DataHTTPService } from '../dataManagement/service/dataHTTP.service'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee, faFilter, faChevronDown } from '@fortawesome/free-solid-svg-icons';
//import { CanvasModule } from '../canvas/canvas.module';
import { ViewModule } from '../ui/components/views/view.module';
import { AppUserComponent } from 'src/app/user/app-user-component/app-user.component';
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
    , ngMaterialModule
    , d3Module
    , NASRoute
    , FontAwesomeModule
    //  , CanvasModule
    , ViewModule
  ],

  declarations: [
    NAS_APPPrimaryOutletPageComponent
    , SystemInventoryComponent
    , HRMProductionHistoryComponent
    , AppUserComponent
  ],
  exports: [ngMaterialModule, d3Module],

  providers: [D3Service
    , FilterService
    , DataHTTPService]
})

export class NAS_AppModule { }
