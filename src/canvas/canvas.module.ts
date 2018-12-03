import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from './component/canvas.component';
import { } from './canvas.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CanvasComponent],
  exports: [CanvasComponent]
})
export class CanvasModule { }
