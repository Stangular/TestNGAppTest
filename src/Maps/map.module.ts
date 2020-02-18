import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OlMapComponent } from './Openlayers/olMap.component';
import { ngMaterialModule } from 'src/ui/module/ngMaterialUI.module';
import { CanvasModule } from 'src/canvas/canvas.module';


@NgModule({
  imports: [
    ngMaterialModule
    , FormsModule
    , ReactiveFormsModule
    , CommonModule
    , CanvasModule
  ],

  declarations: [OlMapComponent],
  exports: [OlMapComponent],

  providers: []
})

export class MapModule { }
