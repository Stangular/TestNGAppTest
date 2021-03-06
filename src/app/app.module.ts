import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
//import '../styles/styles.scss';
import '../styles/headings.css';
import { TokenService } from './user/token/token.service';
import { UserService } from './user/service/app-user.service';
import { LayoutService } from './services/layout/layout-service.service';
import { PopupContentComponent } from './popup/popup-content.component';
import { LoginComponent } from './login/login.component';
import { ContentUtilityComponent } from './common/content-utility/content-utility.component';
import { MessageService } from './messaging/message.service';
import { ActiveCanvasComponent } from './active-canvas/active-canvas.component';
import { TreeviewComponent } from '../models/tree/treeview/treeview.component';
import { TreeviewlistComponent } from '../models/tree/treeviewlist/treeviewlist.component';
import { TreeviewnodeComponent } from '../models/tree/treeviewnode/treeviewnode.component';
import { CheckSelectorComponent } from 'src/ui/components/sequencing/check/check-selector/check-selector.component';
import { RadioSelectorComponent } from 'src/ui/components/sequencing/radio/radio-selector/radio-selector.component';
import { DropdownSelectorComponent } from 'src/ui/components/sequencing/select/dropdown-selector/dropdown-selector.component';
import { TabSelectorComponent } from 'src/ui/components/sequencing/tab/tab-selector/tab-selector.component';
//import { TreeviewService } from '../models/tree/service/treeview.service';

//import { UserLoginLibModule } from 'user-login-lib';
@NgModule({
  imports: [
    CommonModule
    , RouterModule
    , AppRoutes
    , HttpClientModule
    , BrowserModule
    , BrowserAnimationsModule
    , NAS_AppModule
    , FormsModule
    , ReactiveFormsModule
    //, UserLoginLibModule
  ],

  declarations: [
    AppComponent
    , NavMenuComponent
    , PopupContentComponent
    , LoginComponent
    , ContentUtilityComponent
    , ActiveCanvasComponent
    , TreeviewComponent
    , TreeviewlistComponent
    , TreeviewnodeComponent, CheckSelectorComponent, RadioSelectorComponent, DropdownSelectorComponent, TabSelectorComponent
  ],

  exports: [
    NavMenuComponent
  ],
  providers: [
    AppDataService
    , TokenService
    , UserService
    , LayoutService
   // , TreeviewService
    , MessageService],

  bootstrap: [AppComponent]
})

export class AppModule { }
