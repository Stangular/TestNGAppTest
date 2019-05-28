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
import { UpdatePortDialog } from 'src/ui/components/views/form/dialogs/addport/update-port-dialog.component';
import { CanvasGraphicStateDialogComponent } from 'src/ui/components/views/form/dialogs/canvas-graphic-state-dialog/canvas-graphic-state-dialog.component';
import { UpdateLineDialog } from 'src/ui/components/views/form/dialogs/addline/update-line-dialog.component';
import { LineService } from './models/lines/service/line.service';

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
    , UpdatePortDialog
    , CanvasGraphicStateDialogComponent
    , UpdateLineDialog
    , ToolboxCanvasComponent],

  exports: [CanvasComponent
    , DashboardPageComponent
    , DesignerPageComponent
    , CanvasDesignerPropertyToolbarComponent
    , UpdatePortDialog
    , CanvasGraphicStateDialogComponent
    , UpdateLineDialog
    , ToolboxCanvasComponent],
  entryComponents: [
    UpdatePortDialog
    , UpdateLineDialog
    , CanvasGraphicStateDialogComponent],
  providers: [CanvasService
      , LineService]
})
export class CanvasModule { }
