import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
//import { NavMenuComponent } from './navigation/navmenu.component';
import { AppRoutes } from './app.routes';
import { AppDataService } from '../dataManagement/service/appData.service';
//import { ProjectModule } from '../appProject/modules/project.module';
//import { NAS_APPPrimaryOutletPageComponent } from '../../src/NAS_App/NAS_APPPrimaryOutletPage.component';
//import "@angular/material/prebuilt-themes/indigo-pink.css";
//import '../styles/styles.scss';
import '../styles/headings.css';
import { TokenService } from './user/token/token.service';
import { UserService } from './user/service/app-user.service';
import { LayoutService } from './services/layout/layout-service.service';
//import { PopupContentComponent } from './popup/popup-content.component';
//import { LoginComponent } from './login/login.component';
//import { ContentUtilityComponent } from './common/content-utility/content-utility.component';
import { MessageService } from './messaging/message.service';
import { ActiveCanvasComponent } from './active-canvas/active-canvas.component';
import { DropdownSelectorComponent } from 'src/ui/components/sequencing/select/dropdown-selector/dropdown-selector.component';
import { TabSelectorComponent } from 'src/ui/components/sequencing/tab/tab-selector/tab-selector.component';
import { LostCause_AppModule } from 'src/apps/LostCauseAnalysis/LostCause.module';
import { AppUserComponent } from './user/app-user-component/app-user.component';
import { NavigationService } from 'src/models/navigation/navigationService';
import { DataHTTPService } from 'src/dataManagement/service/dataHTTP.service';
import { NAS_AppModule } from 'src/NAS_App/NAS_App.module';
import { ngMaterialModule } from 'src/ui/module/ngMaterialUI.module';
import { DNASegments_AppModule } from 'src/apps/CanvasApps/DNAAnalysis/DNASegments.module';
import { MongoDataService } from 'src/dataManagement/service/mongodb/mongoDB.service';

@NgModule({
  imports: [
    CommonModule
    , RouterModule
    , AppRoutes
    , HttpClientModule
    , ngMaterialModule
    , BrowserModule
    , BrowserAnimationsModule
    , FormsModule
    , ReactiveFormsModule
    , NAS_AppModule
    , DNASegments_AppModule
    , LostCause_AppModule
  ],

  declarations: [
    AppComponent
    , ActiveCanvasComponent
    , DropdownSelectorComponent
    , TabSelectorComponent
    , AppUserComponent
  ],

  exports: [
    ngMaterialModule
  ],
  providers: [
    AppDataService
    , MongoDataService
    , TokenService
    , UserService
    , LayoutService
    , NavigationService
    , DataHTTPService
    , MessageService],

  bootstrap: [AppComponent]
})

export class AppModule { }
