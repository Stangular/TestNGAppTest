import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from './component/canvas.component';
import { DashboardPageComponent } from './dashboard/dashboard-page/dashboard-page.component';
import { ngMaterialModule } from 'src/ui/module/ngMaterialUI.module';
import { ToolboxCanvasComponent } from './component/toolbox-canvas/toolbox-canvas.component';
import { library } from '@fortawesome/fontawesome-svg-core';
import {  faFilter, faChevronDown, faSquare } from '@fortawesome/free-solid-svg-icons';
import { CanvasDesignerPropertyToolbarComponent } from './component/designer/propertytoolbar/canvas-designer-property-toolbar.component';
import { DesignerPageComponent } from './component/designer/designer-page/designer-page.component';
import { CanvasService } from './service/canvas.service';
import { ColorPickerModule } from 'ngx-color-picker';

library.add(
   faFilter
  , faChevronDown
  , faSquare
);
@NgModule({
  imports: [

    FormsModule
    , ReactiveFormsModule
    , CommonModule
    , ngMaterialModule
    , ColorPickerModule
  ],
  declarations: [
    CanvasComponent
    , DashboardPageComponent
    , DesignerPageComponent
    , CanvasDesignerPropertyToolbarComponent
    , ToolboxCanvasComponent],

  exports: [CanvasComponent
    , DashboardPageComponent
    , DesignerPageComponent
    , CanvasDesignerPropertyToolbarComponent
    , ToolboxCanvasComponent],
  providers: [CanvasService]
})
export class CanvasModule { }
