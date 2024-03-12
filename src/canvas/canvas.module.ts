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
import { PortService } from './models/shapes/service/port.service';
import { PathService } from './models/shapes/service/path.service';
import { DisplayStateSelectorComponent } from './component/displaystate/displayStateSelector.component';
import { ShapePropertyDialogComponent } from './component/dialogs/shape/shapePropertyDialog.component';
import { UnitCellDialogComponent } from './component/dialogs/unitcell/unitCellPropertyDialog.component';
import { WaitComponent } from 'src/ui/components/views/form/wait/wait.component';
import { ImageUploadModule } from "angular2-image-upload";
import { StaticCanvasComponent } from 'src/canvas/component/layers/Static/staticCanvas.component';
import { EditCanvasComponent } from 'src/canvas/component/layers/Edit/editCanvas.component';
import { ActionCanvasComponent } from 'src/canvas/component/layers/Action/actionCanvas.component';
import { TimeLineService } from 'src/components/timeline/service/timeLine.service';

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
    , ImageUploadModule.forRoot()
    , ColorPickerModule

  ],
  declarations: [
    CanvasComponent
  //  , DashboardPageComponent
    , DesignerPageComponent
    , CanvasDesignerPropertyToolbarComponent
    , UpdatePortDialog
    , CanvasGraphicStateDialogComponent
    , UpdateLineDialog
    , WaitComponent
    , ShapePropertyDialogComponent
    , UnitCellDialogComponent
    , ToolboxCanvasComponent
    , DisplayStateSelectorComponent
    , StaticCanvasComponent
    , EditCanvasComponent
    , ActionCanvasComponent],

  exports: [CanvasComponent
  //  , DashboardPageComponent
    , DesignerPageComponent
    , CanvasDesignerPropertyToolbarComponent
    , UpdatePortDialog
    , CanvasGraphicStateDialogComponent
    , UpdateLineDialog
    , ShapePropertyDialogComponent
    , UnitCellDialogComponent
    , DisplayStateSelectorComponent
    , ToolboxCanvasComponent
    , StaticCanvasComponent
    , EditCanvasComponent
    , ActionCanvasComponent],
  entryComponents: [
    UpdatePortDialog
    , UpdateLineDialog
    , ShapePropertyDialogComponent
    , UnitCellDialogComponent
    , CanvasGraphicStateDialogComponent],
  providers: [CanvasService
    , TimeLineService
    , LineService
    , PortService
    , PathService]
})
export class CanvasModule { }
