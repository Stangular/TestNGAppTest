import { Component, OnInit, ViewContainerRef,Output,EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { CanvasService, objectTypes} from 'src/canvas/service/canvas.service';
import { FreedomOfMotion } from 'src/canvas/models/shapes/shape';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-canvas-designer-property-toolbar',
  templateUrl: './canvas-designer-property-toolbar.component.html',
  styleUrls: ['./canvas-designer-property-toolbar.component.css']
})
export class CanvasDesignerPropertyToolbarComponent implements OnInit {

  @Output() selectedType = new EventEmitter<objectTypes>();
  @Output() deleteSelectedItem = new EventEmitter<void>();
  @Output() copySelectedItem = new EventEmitter<void>();
  ot = objectTypes;
  width: number = 1;

  shapeClass: string = '';
  port: string = '';
  line: string = '';
  shapeClassList: string[] = ['one', 'two', 'three'];
  portList: string[] = ['pone', 'ptwo', 'pthree'];
  stateList: string[] = ['sone', 'stwo', 'sthree'];
  filteredshapeClassList: Observable<string[]>;
  filteredPortList: Observable<string[]>;
  filteredStateList: Observable<string[]>;
  shapeClassControl = new FormControl();
  portControl = new FormControl();
  stateControl = new FormControl();
  widthControl = new FormControl();
  lockedRatio: boolean = false;
  constantArea: boolean = false;
  freedomOfMotion: FreedomOfMotion = FreedomOfMotion.full;
  freedomOfSizing: FreedomOfMotion = FreedomOfMotion.full;
  fom = FreedomOfMotion;
  public arrayColors: any = {
    color1: '#2883e9',
    color2: '#e920e9',
    color3: 'rgb(255,245,0)',
    color4: 'rgb(236,64,64)',
    color5: 'rgba(45,208,45,1)'
  };
  shapeColor: string = '';
  public cmykColor: Cmyk = new Cmyk(0, 0, 0, 0);
  private currentColor: string = 'color1';
  constructor(
    public vcRef: ViewContainerRef,
    private canvasService: CanvasService
    , private cpService: ColorPickerService
  ) {
    this.constantArea = this.CanvasService.ShapeProperties._constantArea;
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
  }

  get CanvasService() {
    return this.canvasService;
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

  public onChangeColorCmyk(color: string): Cmyk {
    const hsva = this.cpService.stringToHsva(color);

    if (hsva) {
      const rgba = this.cpService.hsvaToRgba(hsva);

      return this.cpService.rgbaToCmyk(rgba);
    }

    return new Cmyk(0, 0, 0, 0);
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
}
