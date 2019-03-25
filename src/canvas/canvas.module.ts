import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from './component/canvas.component';
import { CanvasService } from './canvas.service';
import { DashboardPageComponent } from './dashboard/dashboard-page/dashboard-page.component';
import { ngMaterialModule } from 'src/ui/module/ngMaterialUI.module';
import { DesignerPageComponent } from './models/designer/designer-page/designer-page.component';
import { ToolboxCanvasComponent } from './component/toolbox-canvas/toolbox-canvas.component';

@NgModule({
  imports: [
    CommonModule
    , ngMaterialModule
  ],
  declarations: [
    CanvasComponent
    , DashboardPageComponent
    , DesignerPageComponent
    , ToolboxCanvasComponent],
  exports: [
    ngMaterialModule
    , CanvasComponent
    , DashboardPageComponent
    , DesignerPageComponent
    , ToolboxCanvasComponent],
  providers: [CanvasService]
})
export class CanvasModule { }
