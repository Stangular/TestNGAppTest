import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
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
import { SandboxComponent } from '../../../app/sandbox/sandbox.component';
import { PlaceComponent } from 'src/components/place/place.component';
import { PlaceTreeComponent } from 'src/components/placetree/placetree.component';
import { FamilyLineageModule } from 'src/FamilyLineage/family-lineage.module';
import { LoginComponent } from 'src/app/login/login.component';
import { PopupContentComponent } from 'src/app/popup/popup-content.component';
import { CheckSelectorComponent } from '../sequencing/check/check-selector/check-selector.component';
import { ContentUtilityComponent } from 'src/app/common/content-utility/content-utility.component';
import { HomeDefaultComponent } from 'src/app/home-default/home-default.component';
import { FileUploaderComponent } from 'src/app/common/file-uploader/file-uploader.component';
import { UploadFileDialog } from './form/dialogs/upload/upload-file';
import { NavMenuComponent } from 'src/app/navigation/navmenu.component';
import { NAS_APPPrimaryOutletPageComponent } from 'src/NAS_App/NAS_APPPrimaryOutletPage.component';
import { LostCauseComponent } from 'src/apps/LostCauseAnalysis/LostCause.component';
import { SiteMapComponent } from 'src/app/common/site-map/site-map.component';
import { DashboardPageComponent } from 'src/canvas/dashboard/dashboard-page/dashboard-page.component';
import { ContentGridComponent } from 'src/app/common/content_display/contentGrid.component';
import { ContentRowComponent } from 'src/app/common/content_display/contentRow.component';

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
    , RouterModule
    , ReactiveFormsModule
    , CanvasModule
    , ngMaterialModule
    , FontAwesomeModule
    , ColorPickerModule
    , FamilyLineageModule
    , Ng4LoadingSpinnerModule.forRoot()
  ],

  declarations: [
    FormInputElementComponent
    , DetailViewComponent
    , CardViewComponent
    , TableViewComponent
    , FormComponent
    , FileUploaderComponent
    , FormPagingComponent
    , FormFilteringComponent
    , SaveFormSuccessSnackComponent
    , SelectListComponent
    , AcknowlegeDeleteDialog
    , UploadFileDialog
    , CanvasShapePropertyDialogComponent
    , PlaceComponent
    , PlaceTreeComponent
    , SandboxComponent
    , ContentUtilityComponent
    , LoginComponent
    , PopupContentComponent
    , CheckSelectorComponent
  //  , AppUserComponent
    //, NavMenuComponent
    , NavMenuComponent
    , HomeDefaultComponent
    , SiteMapComponent
    , NAS_APPPrimaryOutletPageComponent
    , LostCauseComponent
    , DashboardPageComponent
    , ContentGridComponent
   , ContentRowComponent

  ],
  exports: [
    DetailViewComponent
    , CardViewComponent
    , TableViewComponent
    , FormComponent
    , FileUploaderComponent
    , FormFilteringComponent
    , SaveFormSuccessSnackComponent
    , AcknowlegeDeleteDialog
    , UploadFileDialog
    , SandboxComponent
    , PlaceComponent
    , PlaceTreeComponent
    , LoginComponent
    , NavMenuComponent
    //, NavMenuComponent
    , HomeDefaultComponent
    , SiteMapComponent
    , CanvasShapePropertyDialogComponent
        , NAS_APPPrimaryOutletPageComponent
    , LostCauseComponent
    , DashboardPageComponent
    , CanvasModule
    , MapModule
    , ngMaterialModule],
  entryComponents: [
    AcknowlegeDeleteDialog
    , UploadFileDialog
    , FormFilteringComponent],
  providers: [
    PagingService
  ]
})
export class ViewModule { }
