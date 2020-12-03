import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FamilyComponent } from './Components/family/family.component';
import { PersonComponent } from './Components/person/person.component';
import { ngMaterialModule } from 'src/ui/module/ngMaterialUI.module';
import { AutoCompleteEditComponent } from 'src/ui/components/autocomplete/auto-complete-edit/auto-complete-edit.component';

@NgModule({
  imports: [
    CommonModule
    , FormsModule
    , ReactiveFormsModule
    , ngMaterialModule
  ],
  declarations: [
    FamilyComponent
    , PersonComponent
    , AutoCompleteEditComponent],
  exports: [
    FamilyComponent
    , PersonComponent]
})
export class FamilyLineageModule { }
