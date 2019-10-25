import {
  Component, OnInit, ViewContainerRef, Input, Output, EventEmitter,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { CanvasService, objectTypes } from 'src/canvas/service/canvas.service';
import { FreedomOfMotion, AreaType } from 'src/canvas/models/shapes/IShape';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { map, startWith } from 'rxjs/operators';
import { DisplayValues } from 'src/canvas/models/DisplayValues';
import { MessageService } from 'src/app/messaging/message.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { UpdatePortDialog } from 'src/ui/components/views/form/dialogs/addport/update-port-dialog.component';
import { CanvasGraphicStateDialogComponent } from 'src/ui/components/views/form/dialogs/canvas-graphic-state-dialog/canvas-graphic-state-dialog.component';
import { UpdateLineDialog } from 'src/ui/components/views/form/dialogs/addline/update-line-dialog.component';
import { LineService } from 'src/canvas/models/lines/service/line.service';
import { PortService } from 'src/canvas/models/shapes/service/port.service';
import { eContentType } from 'src/canvas/models/shapes/shapeSelected';
import { ePortType } from 'src/canvas/models/shapes/port';
import { lineTypes, PortPath } from 'src/canvas/models/lines/line';
import { PathService } from 'src/canvas/models/shapes/service/path.service';
import { ShapePropertyDialogComponent } from '../../dialogs/shape/shapePropertyDialog.component';
import { DataHTTPService } from 'src/dataManagement/service/dataHTTP.service';
import { UnitCell } from 'src/canvas/models/IContextItem';
import { GraphicsModel } from 'src/canvas/service/graphicsModel';
import { UnitCellDialogComponent } from '../../dialogs/unitcell/unitCellPropertyDialog.component';
//import { WaitDialogComponent } from 'src/ui/components/views/form/dialogs/wait/wait.component';



@Component({
  selector: 'app-canvas-designer-property-toolbar',
  templateUrl: './canvas-designer-property-toolbar.component.html',
  styleUrls: ['./canvas-designer-property-toolbar.component.css']
})
export class CanvasDesignerPropertyToolbarComponent implements OnInit, OnDestroy {

  messageSubscription: Subscription;
  selectedColor: string = '';
  @Input() PropertyId: string = '';
  @Input() selectedItemTop: number = 0;
  @Input() selectedItemLeft: number = 0;
  @Input() selectedItemWidth: number = 0;
  @Input() selectedItemHeight: number = 0;
  @Output() selectedType = new EventEmitter<objectTypes>();
  @Output() deleteSelectedItem = new EventEmitter<void>();
  @Output() copySelectedItem = new EventEmitter<void>();
  @Output() updatePort = new EventEmitter<any>();
  @Output() colorSelected = new EventEmitter<{ type: string, color: string }>();
  @Output() shapeChanged = new EventEmitter<string>();
  ot = objectTypes;
  width: number = 1;
  ShapeDetailsForm: FormGroup;
  shapeClass: string = '';
  port: string = '';
  line: string = '';
  colors: string[] = [];
  shapeClassList: string[] = ['one', 'two', 'three'];
  portList: string[] = ['pone', 'ptwo', 'pthree'];
  stateList: string[] = ['sone', 'stwo', 'sthree'];
//  unitCellList: Observable<UnitCell[]>;
  filteredPortList: Observable<string[]>;
  filteredStateList: Observable<string[]>;
  portControl = new FormControl();
  stateControl = new FormControl();
  lineWidthControl = new FormControl();
  widthControl = new FormControl();
  heightControl = new FormControl();
  colorControl = new FormControl();
  locxControl = new FormControl();
  locyControl = new FormControl();
  selectedUnitCellId = '';

  //public arrayColors: any = {
  //  color1: '#2883e9',
  //  color2: '#e920e9',
  //  color3: 'rgb(255,245,0)',
  //  color4: 'rgb(236,64,64)',
  //  color5: 'rgba(45,208,45,1)'
  //};
  shapeColor: string = '';
  public cmykColor: Cmyk = new Cmyk(0, 0, 0, 0);
  //private currentColor: string = 'color1';
  constructor(
    public _httpService: DataHTTPService,
    public portService: PortService,
    public pathService: PathService,
    public vcRef: ViewContainerRef
    , private canvasService: CanvasService
    , private cpService: ColorPickerService
    , public dialog: MatDialog
    , fb: FormBuilder
    , private lineService: LineService
    , private messageService: MessageService) {

 
    this.ShapeDetailsForm = fb.group({
      locX: this.selectedItemLeft,
      locY: this.selectedItemTop,
      sizeX: this.selectedItemWidth,
      sizeY: this.selectedItemHeight
    });
    this.messageSubscription =
      this.messageService
        .getMessage()
      .subscribe(message => { this.Update(message); });

  }

  ngOnInit() {
    //this.filteredUnitCellList = this.unitCellControl.valueChanges
    //  .pipe(
    //    startWith(''),
    //  map(value => this._filterUnitCell(value))
    //  );

    this.filteredPortList = this.portControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterPorts(value))
      );

    this.filteredStateList = this.stateControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterstates(value))
      );

    this.selectedColor = this.BGColor;

    this.canvasService.RetrieveInitial();

  }

  get CanvasService() {
    return this.canvasService;
  }

  get LocY(): FormControl {
    return this.ShapeDetailsForm.controls['locY'] as FormControl;
  }

  get LocX(): FormControl {
    return this.ShapeDetailsForm.controls['locX'] as FormControl;
  }

  get SizeY(): FormControl {
    return this.ShapeDetailsForm.controls['sizeY'] as FormControl;
  }

  get SizeX(): FormControl {
    return this.ShapeDetailsForm.controls['sizeX'] as FormControl;
  }

  Update(message: any) {
    switch (message.text) {
      case 11: break;
      default:
        this.LocY.setValue(Math.floor(this.selectedItemTop));
        this.LocX.setValue(Math.floor(this.selectedItemLeft));
        this.SizeY.setValue(Math.floor(this.selectedItemHeight));
        this.SizeX.setValue(Math.floor(this.selectedItemWidth));
      break;
    }
  }

  get selectedTypeClass() {
    let typeClass: String = '';
    switch (this.canvasService.selectedType) {
      case eContentType.rectangle: typeClass = 'designer_rect_image'; break;
      case eContentType.ellipse: typeClass = 'designer_ellipse_image'; break;
      //case eContentType.port: typeClass = 'designer_port_image'; break;
      //case eContentType.line: typeClass = 'designer_line_image'; break;
      //case eContentType.gradientLine: typeClass = 'designer_gradient_line_image'; break;
      //case eContentType.bezierLine: typeClass = 'designer_bezier_line_image'; break;
    }
    return typeClass;
  }

  public onEventLog(event: string, data: any): void {
    console.log(event, data);
  }

  SetProperties() {
    let propID = this.PropertyId + '_bg';
    this.selectedColor = DisplayValues.GetColorByName(propID);
    return this.selectedColor;
  }

  public get BGColor() {
    let propID = this.PropertyId + '_bg';
    this.selectedColor = DisplayValues.GetColorByName(propID);
    return this.selectedColor;
  }
  
  public onChangeColorCmyk(color: string): Cmyk {
    const hsva = this.cpService.stringToHsva(color);

    if (hsva) {
      const rgba = this.cpService.hsvaToRgba(hsva);

      return this.cpService.rgbaToCmyk(rgba);
    }

    return new Cmyk(0, 0, 0, 0);
  }

  ApplyColor(type: string) {
    this.colorSelected.emit({ type: type, color: this.selectedColor });
  }

  public onChangeColorHex8(color: string): string {
    const hsva = this.cpService.stringToHsva(color, true);

    if (hsva) {
      return this.cpService.outputFormat(hsva, 'rgba', null);
    }

    return '';
  }

  RetrieveUnitCell(selectedItem: any) {
    this.selectedUnitCellId = selectedItem.value.Id;
    this.canvasService.RetrieveShape(this.selectedUnitCellId);
  }
  //private _filterUnitCell(value: string): UnitCell[] {
  //  const filterValue = value.toLowerCase();

  //  return this.canvasService.BaseSystem.Cells.filter(option => option.Name.toLowerCase().includes(filterValue));
  //}

  private _filterPorts(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.portList.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterstates(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.stateList.filter(option => option.toLowerCase().includes(filterValue));
  }

  SelectObject(objectType: any) {
    switch (objectType.target.id) {
      case 'rectType': this.canvasService.selectedType = eContentType.rectangle; break;
      case 'ellipseType': this.canvasService.selectedType = eContentType.ellipse; break;
      //case 'portType': this.canvasService.selectedType = objectTypes.port; break;
      //case 'lineType': this.canvasService.selectedType = objectTypes.line; break;
      //case 'gradientType': this.canvasService.selectedType = objectTypes.gradientLine; break;
      //case 'bezierType': this.canvasService.selectedType = objectTypes.bezierLine; break;
    }
   // this.selectedType.emit(this.canvasService.selectedType);
  }

  LoadData() {
    this.canvasService.RetrieveInitial();
  }

  CopyObject(objectType: any) {
    this.copySelectedItem.emit();
  }

  DeleteObject(objectType: any) {
    this.deleteSelectedItem.emit();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.messageSubscription.unsubscribe();
  }
  
  UpdateLine(): void {
    const dialogRef = this.dialog.open(UpdateLineDialog, {
      width: '350px',
      data: { name: '', type: lineTypes.straight, paths: [], state: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.canvasService.AddLine(result);
      }
    });
  }
  
  ShowLineDialog() {
    
  }

  UpdateState(): void {
    const dialogRef = this.dialog.open(CanvasGraphicStateDialogComponent, {
      width: '350px',
      data: { weight: 1,color:'#000000',state:''}
    });

    dialogRef.afterClosed().subscribe(result => {
      DisplayValues.SetColor(result.state, result.color || '#ffffff');
      DisplayValues.SetWeight(result.state, result.weight || 1);
      DisplayValues.SetFont(result.state, result.font || 'verdana');
      this.canvasService.UpdateState(result);
    });
  }

  ManageUnitCell(): void {
    const dialogRef = this.dialog.open(UnitCellDialogComponent, {
      width: '450px',
      data: {}});

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  ManageShape(): void {
    const dialogRef = this.dialog.open(ShapePropertyDialogComponent, {
      width: '700px',
      data: {
        name: this.canvasService.ActiveShape.Id,
        state: this.canvasService.ActiveShape.StateName,
        areaType: this.canvasService.ActiveShape.AreaType,
        freedomOfMotion: this.canvasService.ActiveShape.FreedomOfMotion,
        freedomOfSizing: this.canvasService.ActiveShape.FreedomOfSizing,
        width: this.canvasService.ActiveShape.Width,
        height: this.canvasService.ActiveShape.Height,
        port: { result: 'update', offsetX: 10, offsetY: 10, path: '', name: '', type: ePortType.source, paths: this.canvasService.BaseSystem.Paths }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.canvasService.ActiveShape.SetProperties(result);
      this.canvasService.DrawSystem(this.canvasService.SelectedUnitCellId);
    });
  }

  get Cells() {
    if (!this.canvasService.BaseSystem) {
      return [];
    }
    return this.canvasService.BaseSystem.Layers || [];
  }

  SaveUnitCell() {
    if (this.selectedUnitCellId.length <= 0) { return; }
    let ucell = this.Cells.find(c => c.Id == this.selectedUnitCellId);
    if (ucell) {
      this.canvasService.UpdateSystem(ucell.Id, ucell.UnitCell.Name);
    }
  }

  NewUnitCell() {
    this.ManageUnitCell();
  }

  RemoveShape() {
    this.canvasService.BaseSystem.RemoveContent();
    this.canvasService.DrawSystem(this.canvasService.SelectedUnitCellId);
  }

  ManagePorts(): void {
    //  this.portService.a
    const dialogRef = this.dialog.open(UpdatePortDialog, {
      width: '350px',
      data: { result: 'update', offsetX: 10, offsetY: 10, path: '', name: '', type: ePortType.source, paths: this.canvasService.BaseSystem.Paths }
    });
    dialogRef.afterClosed().subscribe(result => {
      //add to port service...
      if (result) { this.updatePort.emit(result); }
    });
  }
}
