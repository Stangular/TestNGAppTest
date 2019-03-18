import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from './component/canvas.component';
import { CanvasService } from './canvas.service';
import { DashboardPageComponent } from './dashboard/dashboard-page/dashboard-page.component';
import { ngMaterialModule } from 'src/ui/module/ngMaterialUI.module';

@NgModule({
  imports: [
    CommonModule
    , ngMaterialModule
  ],
  declarations: [
    CanvasComponent
    , DashboardPageComponent],
  exports: [
    ngMaterialModule
    , CanvasComponent
    , DashboardPageComponent],
  providers: [CanvasService]
})
export class CanvasModule { }
