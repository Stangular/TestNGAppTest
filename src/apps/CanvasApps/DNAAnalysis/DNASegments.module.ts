import { NgModule } from '@angular/core';
import { ElementDefinitionFactoryService } from 'src/dataManagement/service/elementDefinitionFactoryService';
import { NavigationService } from 'src/models/navigation/navigationService';

import { Routes, RouterModule } from '@angular/router';
import { ViewModule } from 'src/ui/components/views/view.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DNASegmentsComponent } from './DNASegments.component';
//import { NavMenuComponent } from 'src/app/navigation/navmenu.component';
// Add an icon to the library for convenient access in other components


@NgModule({
  imports: [
    CommonModule
    , FormsModule
    , ReactiveFormsModule
    , RouterModule
    , ViewModule],

  declarations: [
    DNASegmentsComponent
  ],
  exports: [],

  providers: [
    ElementDefinitionFactoryService
    , NavigationService
  ]
})

export class DNASegments_AppModule { }
