import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ngMaterialModule } from 'src/ui/module/ngMaterialUI.module';
import { TimeLineUIComponent } from '../timeLineUI.component';

@NgModule({
  imports: [
    CommonModule
    , FormsModule
    , ReactiveFormsModule
    , ngMaterialModule
  ],

  declarations: [
    TimeLineUIComponent
  ],
  exports: [
    TimeLineUIComponent
  ]
})

export class TimeLineModule { }
