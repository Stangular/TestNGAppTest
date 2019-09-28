import { IShape } from '../../IShape';
import { Shape } from '../../shape';
import { IContextItem, ContextSystem } from '../../../IContextItem';
import { DisplayValues, StateIndex, UIStates } from '../../../DisplayValues'
import { Point } from '../../primitives/point';
import { ShapeSelectResult } from '../../shapeSelected';
import { Rectangle } from '../../rectangle';
import { Content } from '../Content';

const localImagePath = '../images/';

export class ContentImage extends Shape {

  private _onloadSet = false;
  private _ready = false;
  private _image: HTMLImageElement;
  private _context : any;
  constructor(
    id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    protected content: Content) {
    super(id, top, left, 100, 100, content.State);
    this._image = new Image();
    
  }

  DrawShape(context: any): void {

    context.drawImage(this._image, this.Left + 5, this.Top + 5, this.Width - 10, this.Height - 10);

  }
  

  Draw(context: any): void {

    if (!this._ready && !this._onloadSet) {
      let self = this;
      this._onloadSet = true;
      this._image.src = "";
  //    this._image.addEventListener("load", this.Draw(context), false);
      this._image.onload = function () {
        self._ready = true;
        self.Draw(context);
      }
      this._image.src = localImagePath + self.content.Content;
      return;
    }
    this.DrawShape(context);
  }

  imageReady() {
    this._ready = true;
    this.Draw(this._context);
  }

  CopyShape(newID: string): ContentImage {

    return new ContentImage(newID, this.Top + 10, this.Left + 10, this.Width, this.Height,this.content);
  }

  CopyItem(newID: string) {
    return this.CopyShape(newID);
  }

  Save(): any {

    return {
      Id: this.Id,
      Top: Math.ceil(this.Top),
      Left: Math.ceil(this.Left),
      Width: Math.ceil(this.width),
      Height: Math.ceil(this.height),
      Type: 0,
      CornerRadius: 0,
      Shadow: 0,
      DisplayValueId: '',
      Ports: [],
      Shapes: [],
      Content: {
        Id: this.content.ID,
        Content: this.content.Content,
        Code: this.content.Code,
        ParentShapeId: '',
        DisplayValueId: this.content.State,
        angle: this.content.Angle
      }
    }
  }
}
