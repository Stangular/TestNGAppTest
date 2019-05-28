import {
  Component, OnInit, ViewContainerRef, Input, Output, EventEmitter,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { CanvasService, objectTypes } from 'src/canvas/service/canvas.service';
import { FreedomOfMotion } from 'src/canvas/models/shapes/shape';
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
  filteredshapeClassList: Observable<string[]>;
  filteredPortList: Observable<string[]>;
  filteredStateList: Observable<string[]>;
  shapeClassControl = new FormControl();
  portControl = new FormControl();
  stateControl = new FormControl();
  lineWidthControl = new FormControl();
  widthControl = new FormControl();
  heightControl = new FormControl();
  locxControl = new FormControl();
  locyControl = new FormControl();
  lockedRatio: boolean = false;
  constantArea: boolean = false;
  freedomOfMotion: FreedomOfMotion = FreedomOfMotion.full;
  freedomOfSizing: FreedomOfMotion = FreedomOfMotion.full;
  fom = FreedomOfMotion;
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
    public portService: PortService,
    public vcRef: ViewContainerRef
    , private canvasService: CanvasService
    , private cpService: ColorPickerService
    , public dialog: MatDialog
    , fb: FormBuilder
    , private lines: LineService
    , private messageService: MessageService) {

    this.constantArea = this.CanvasService.ShapeProperties._constantArea;
    this.ShapeDetailsForm = fb.group({
      locX: this.selectedItemLeft,
      locY: this.selectedItemTop,
      sizeX: this.selectedItemWidth,
      sizeY: this.selectedItemHeight
    });
    this.messageSubscription = this.messageService.getMessage().subscribe(message => { this.Update(); });

  }

  ngOnInit() {
    this.filteredshapeClassList = this.shapeClassControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

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

  Update() {
    this.LocY.setValue(Math.floor(this.selectedItemTop));
    this.LocX.setValue(Math.floor(this.selectedItemLeft));
    this.SizeY.setValue(Math.floor(this.selectedItemHeight));
    this.SizeX.setValue(Math.floor(this.selectedItemWidth));
  }


  get selectedTypeClass() {
    let typeClass: String = '';
    switch (this.canvasService.selectedType) {
      case objectTypes.rectangle: typeClass = 'designer_rect_image'; break;
      case objectTypes.ellipse: typeClass = 'designer_ellipse_image'; break;
      case objectTypes.port: typeClass = 'designer_port_image'; break;
      case objectTypes.line: typeClass = 'designer_line_image'; break;
      case objectTypes.gradientLine: typeClass = 'designer_gradient_line_image'; break;
      case objectTypes.bezierLine: typeClass = 'designer_bezier_line_image'; break;
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.shapeClassList.filter(option => option.toLowerCase().includes(filterValue));
  }

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
      case 'rectType': this.canvasService.selectedType = objectTypes.rectangle; break;
      case 'ellipseType': this.canvasService.selectedType = objectTypes.ellipse; break;
      case 'portType': this.canvasService.selectedType = objectTypes.port; break;
      case 'lineType': this.canvasService.selectedType = objectTypes.line; break;
      case 'gradientType': this.canvasService.selectedType = objectTypes.gradientLine; break;
      case 'bezierType': this.canvasService.selectedType = objectTypes.bezierLine; break;
    }
    this.selectedType.emit(this.canvasService.selectedType);
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
  
  UpdatePort(): void {
    this.portService.a
    const dialogRef = this.dialog.open(UpdatePortDialog, {
      width: '250px',
      data: { result: 'update' }
    });
    dialogRef.afterClosed().subscribe(result => {
      //add to port service...
      this.updatePort.emit(result);
    });
  }

  UpdateLine(): void {
    const dialogRef = this.dialog.open(UpdateLineDialog, {
      width: '600px',
      data: { weight: 1, color: '#000000', state: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.lines.AddLine(result.name,result.state);
      }
    });
  }

  UpdateState(): void {
    const dialogRef = this.dialog.open(CanvasGraphicStateDialogComponent, {
      width: '600px',
      data: { weight: 1,color:'#000000',state:'' }
    });

    dialogRef.afterClosed().subscribe(result => {
      DisplayValues.SetColor(result.state, result.color);
      DisplayValues.SetWeight(result.state, result.weight);
    });
  }

}
