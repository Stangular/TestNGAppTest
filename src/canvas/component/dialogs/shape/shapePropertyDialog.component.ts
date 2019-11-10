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
import { ContentShape } from 'src/canvas/models/shapes/content/ContentShape';
import { Content } from 'src/canvas/models/shapes/content/Content';

export enum ContentType {
  general = 0,
  text = 1,
  image = 2
}
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
    paths: PortPath[];
    pathPosition: number;
  }
}

@Component({
  selector: 'shape-property-dialog',
  templateUrl: './shapePropertyDialog.component.html',
  styleUrls: ['./shapePropertyDialog.component.css']
})
export class ShapePropertyDialogComponent implements OnInit{

  contentType: ContentType = ContentType.general;
  shapes: Shape[] = [];
  @Input() cancelMessage: string = 'Cancel';
  @Input() okMessage: string = 'Save';
  @Input() state: string = "";
  ports: Observable<IShape[]>;
  textContentItems: Observable<ContentShape[]>;
 //imageContentItems: Observable<ContentShape[]>;
  modelName = new FormControl();
  textContentItem = new FormControl();
  //imageContentItem = new FormControl();
  stateName = '';
  portName = new FormControl();
  pathName = new FormControl();
  urlToImage = "";
  contentText = "";
  imageContentURL = "";
  imageFromDataSource: boolean = false;
  selectedImage: string = "";
  contentAngle = 0;
  contentState = '';
  containerState = '';
  fromDataSource = false;
  @Output() stateChange: EventEmitter<string> = new EventEmitter<string>();;
  fom = FreedomOfMotion;
  ot = objectTypes;
  at = AreaType;
  ct = ContentType;

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
    this.stateName = select.value;
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
    this.textContentItems = this.textContentItem.valueChanges
      .pipe(
        startWith(''),
      map(value => this._filterTextContent(value))
    );
    //this.imageContentItems = this.imageContentItem.valueChanges
    //  .pipe(
    //  startWith(''),
    //  map(value => this._filterImageContent(value))
    //  );
    if (this.canvasService.ActiveShape.Ports.length > 0) {
      let port = this.canvasService.ActiveShape.Ports[0];
      this.portName.setValue(port.Id);
      this.data.port.offsetX = (<Port>port).OffsetX.toString();
      this.data.port.offsetY = (<Port>port).OffsetY.toString();
      this.data.port.path = (<Port>port).PathId;
    }
  }

  OnStateChange(statename: any) {
    this.stateName = statename.value;
    this.data.state = statename.value;
  }

  get ImagePath() {
    let image = this.imageContentURL || 'icon.png';
    return '../images/' + image;
  }

  PathChange(pathId: any) {
    let path = this.canvasService.BaseSystem.Paths.findIndex(p => p.Id == pathId.value);
    this.data.port.pathPosition = 0;
    if (path >= 0) {
      this.data.port.pathPosition = this.canvasService.BaseSystem.Paths[path].Ports.length;
    }
  }

  ImageChange(image: any) {
    this.imageContentURL = image.value;
    this.textContentItem.setValue(image.value);
  }

  handleChangeImageSource(event: any) {
    this.imageContentURL = "";
  //  this.imageFromDataSource = !this.imageFromDataSource;
  }

  get ImagePostURL() {
    return 'https://localhost:44314/' + 'api/ImageUploader/StreamImageLocally?=S:\Projects\repos\Angular6Sandbox\TestNGApp2\images';
  }

  private _filterTextContent(value: string): ContentShape[] {
    const v = value.toLowerCase();
    let list = (<ContentShape>this.canvasService.ActiveShape).TextContent
      .filter(option => option.Content.Content.toLowerCase().indexOf(v) >= 0);
    if (list.length == 1) {
      this.contentAngle = list[0].Content.Angle;
      this.contentState = list[0].Content.State;
      this.fromDataSource = list[0].Content.FromSource;
    }
    else {
      this.contentAngle = 0;
      this.contentState = "DefaultBG";
    }
    return list;
  }

  //private _filterImageContent(value: string): ContentShape[] {
  //  const v = value.toLowerCase();
  //  let list = (<ContentShape>this.canvasService.ActiveShape).ImageContent
  //    .filter(option => option.Content.Content.toLowerCase().indexOf(v) >= 0);
  //  if (list.length == 1) {
  //    this.contentAngle = list[0].Content.Angle;
  //    this.contentState = list[0].Content.State;
  //    this.fromDataSource = list[0].Content.FromSource;
  //    this.selectedImage = list[0].Content.Content;
  //    this.imageContentURL = this.selectedImage;
  //  }
  //  else {
  //    this.contentAngle = 0;
  //    this.contentState = "DefaultBG";
  //  }
  //  return list;
  //}

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
      this.data.port.pathPosition = port.PathPosition;
    }
    if (list.length <= 0) {
      this.data.port.offsetX = "0";
      this.data.port.offsetY = "0";
      this.data.port.path = '';
      let path = this.canvasService.BaseSystem.Paths.findIndex(p => p.Id == this.data.port.path);
      this.data.port.pathPosition = 0;
      if (path >= 0) {
        this.data.port.pathPosition = this.canvasService.BaseSystem.Paths[path].Ports.length;
      }
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
  }

  //ContentShapes() : ContentShape [] {
  //  return (<Shape>this.canvasService.ActiveShape).Shapes;
  //}
  onUploadStateChanged(e: any) {}

  AddContent() {
    switch (this.contentType) {
      case ContentType.text:
        this.canvasService.AddText(this.textContentItem.value, this.containerState, this.contentState, this.fromDataSource, 0);
        break;
      case ContentType.image:
        this.canvasService.AddImage(this.textContentItem.value, this.containerState, this.contentState, this.fromDataSource, 0);
        break;
      default:
        this.canvasService.AddGeneral(this.textContentItem.value, this.containerState);
        break;
    }
  }

  //AddImage() {
  //  this.canvasService.BaseSystem.AddImage(this.selectedImage, this.textState, this.fromDataSource, 0);
  //}

}
