import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DetailViewComponent } from '../views/detail/detail-view.component';
import { CardViewComponent } from '../views/card/card-view.component';
import { TableViewComponent } from '../views/table/table-view.component';
import { FormComponent } from '../views/form/form.component';
import { FormFilteringComponent } from '../views/form/filtering/form-filtering.component';
import { FormPagingComponent } from '../views/form/paging/form-paging.component';
import { PagingService } from '../views/form/paging/service/paging.service';
import { ngMaterialModule } from '../../module/ngMaterialUI.module';
import { CanvasModule } from '../../../canvas/canvas.module';
import { FormInputElementComponent } from '../../../ui/components/edit/form-input.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { AcknowlegeDeleteDialog } from '../../components/views/form/dialogs/acknowledgeDelete/acknowledge-delete-dialog.component'
import { faCoffee, faFilter, faChevronDown, faSort, } from '@fortawesome/free-solid-svg-icons';
import { SaveFormSuccessSnackComponent } from '../snacks/success/save/form/save-form-success-snack.component'
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { SelectListComponent } from '../select/form-list-select.component';
import { CanvasShapePropertyDialogComponent } from './form/dialogs/canvas-shape-property-dialog/canvas-shape-property-dialog.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { MapModule } from 'src/Maps/map.module';

library.add(
  faCoffee
  , faFilter
  , faChevronDown
  , faSort
);
@NgModule({
  imports: [
    CommonModule
    , MapModule
    , FormsModule
    , ReactiveFormsModule
    , CanvasModule
    , ngMaterialModule
    , FontAwesomeModule
    , ColorPickerModule
    , Ng4LoadingSpinnerModule.forRoot()
  ],

  declarations: [
    FormInputElementComponent
    , DetailViewComponent
    , CardViewComponent
    , TableViewComponent
    , FormComponent
    , FormPagingComponent
    , FormFilteringComponent
    , SaveFormSuccessSnackComponent
    , SelectListComponent
    , AcknowlegeDeleteDialog
    , CanvasShapePropertyDialogComponent
  ],
  exports: [
    DetailViewComponent
    , CardViewComponent
    , TableViewComponent
    , FormComponent
    , FormFilteringComponent
    , SaveFormSuccessSnackComponent
    , AcknowlegeDeleteDialog
    , CanvasShapePropertyDialogComponent],
  entryComponents: [
    AcknowlegeDeleteDialog
    , FormFilteringComponent],
  providers: [
    PagingService
  ]
})
export class ViewModule { }
