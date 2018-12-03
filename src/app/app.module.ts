import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './navigation/navmenu.component';
import { AppRoutes } from './app.routes';
import { AppDataService } from '../dataManagement/service/appData.service';
//import { ProjectModule } from '../appProject/modules/project.module';
import { NAS_AppModule } from '../NAS_App/NAS_App.module';
//import { NAS_APPPrimaryOutletPageComponent } from '../../src/NAS_App/NAS_APPPrimaryOutletPage.component';
//import "@angular/material/prebuilt-themes/indigo-pink.css";
import '../styles/styles.scss';
import '../styles/headings.css';

@NgModule({
  imports: [
    CommonModule
    , RouterModule
    , AppRoutes
    , HttpClientModule
    , BrowserModule
    , BrowserAnimationsModule
    , NAS_AppModule
  ],

  declarations: [
    AppComponent
    , NavMenuComponent
  ],

  exports: [
    NavMenuComponent
  ],
  providers: [AppDataService],
  bootstrap: [AppComponent]
})

export class AppModule { }
