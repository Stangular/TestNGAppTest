import {
  Component, Input, Output, OnInit, EventEmitter, Inject
} from '@angular/core';
import { DisplayValues } from 'src/canvas/models/DisplayValues';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Shape } from 'src/canvas/models/shapes/shape';
import { CanvasService, objectTypes } from 'src/canvas/service/canvas.service';
import { FormControl } from '@angular/forms';
import { ePortType, Port } from 'src/canvas/models/shapes/port';
import { PortPath } from 'src/canvas/models/lines/line';
import { Observable } from 'rxjs';
import { FreedomOfMotion, AreaType, IShape } from 'src/canvas/models/shapes/IShape';
import { startWith, map } from 'rxjs/operators';
import { ImageModel } from 'src/canvas/models/shapes/content/image/image.model';

export interface IShapeData {
  name: string;
  state: string;
  areaType: AreaType;
  freedomOfMotion: FreedomOfMotion;
  freedomOfSizing: FreedomOfMotion;
  width: number;
  height: number;
  cornerRadius: number;
  port: {
    result: string;
    offsetX: string;
    offsetY: string;
    path: string;
    name: string;
    type: ePortType;
    paths: PortPath[]
  }
}

@Component({
  selector: 'shape-property-dialog',
  templateUrl: './shapePropertyDialog.component.html',
  styleUrls: ['./shapePropertyDialog.component.css']
})
export class ShapePropertyDialogComponent implements OnInit{

  shapes: Shape[] = [];
  @Input() cancelMessage: string = 'Cancel';
  @Input() okMessage: string = 'Save';
  @Input() state: string = "";
  ports: Observable<IShape[]>;
  modelName = new FormControl();
  stateName = '';
  portName = new FormControl();
  pathName = new FormControl();
  urlToImage = "";
  textContent = "";
  imageContentURL = "";
  imageFromDataSource: boolean = false;
  selectedImage: string = "";
  textState = "";
  @Output() stateChange: EventEmitter<string> = new EventEmitter<string>();;
  fom = FreedomOfMotion;
  ot = objectTypes;
  at = AreaType;

  constructor(private canvasService: CanvasService,
    public dialogRef: MatDialogRef<ShapePropertyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IShapeData
    , public dialog: MatDialog) {}

  get SelectedImage() {
    return '../Images/' + this.selectedImage;
  }
  get States() {
    return DisplayValues.StateNames;
  }

  AreaTypeChanged(value: AreaType) {
      this.data.freedomOfSizing = FreedomOfMotion.full;
  }

  OnNameChange(value: string) {
    this.data.name = value;
  }

  OnTextStateChange(select: any) {
    this.textState = select.value;
  }

  OnStateChange(select: any) {
    this.data.state = select.value;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.ports = this.portName.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterPort(value))
      );
    if (this.canvasService.ActiveShape.Ports.length > 0) {
      let port = this.canvasService.ActiveShape.Ports[0];
      this.portName.setValue(port.Id);
      this.data.port.offsetX = (<Port>port).OffsetX.toString();
      this.data.port.offsetY = (<Port>port).OffsetY.toString();
      this.data.port.path = (<Port>port).PathId;
    }
  }

  get ImagePath() {
    let image = this.imageContentURL || 'icon.png';
    return '../images/' + image;
  }
  ImageChange(image: any) {
    this.imageContentURL = image.value;
  }

  handleChangeImageSource(event: any) {
    this.imageContentURL = "";
  //  this.imageFromDataSource = !this.imageFromDataSource;
  }

  get ImagePostURL() {
    return 'https://localhost:44314/' + 'api/ImageUploader/StreamImageLocally?=S:\Projects\repos\Angular6Sandbox\TestNGApp2\images';
  }

  private _filterPort(value: string): IShape[] {

    const v = value.toLowerCase();

    this.data.port.name = value;
    this.data.port.paths = [];
    let list = this.canvasService.ActiveShape.Ports
      .filter(option => option.Id.toLowerCase().indexOf(v) >= 0);
    if (list.length == 1) {
      let port = list[0] as Port;
      this.data.port.offsetX = port.OffsetX.toString();
      this.data.port.offsetY = port.OffsetY.toString();
      this.data.port.path = port.PathId;
    }
    if (list.length <= 0) {
      this.data.port.offsetX = "0";
      this.data.port.offsetY = "0";
      this.data.port.path = '';
    }
    if (list.length > 0) {
      this.pathName.setValue(list[0].Id);
    }
    return list;
  }

  onUploadFinished(e: any) {
    if (e.serverResponse.status == 200) {
      var url = JSON.parse(e.serverResponse._body);
      this.urlToImage = url;
    }
    else {

    }
  }

  onUploadStateChanged(e: any) {}

  AddText() {
    this.canvasService.AddText(this.textContent, this.textState, 0);
  }

  AddImage() {
    this.canvasService.BaseSystem.AddImage(this.selectedImage, this.textState, 0);
  }

}
