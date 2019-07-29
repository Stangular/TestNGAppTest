import { IShape } from '../../IShape';
import { Shape } from '../../shape';
import { IContextItem, ContextSystem } from '../../../IContextItem';
import { DisplayValues, StateIndex, UIStates } from '../../../DisplayValues'
import { Point } from '../../primitives/point';
import { ShapeSelectResult } from '../../shapeSelected';
import { Rectangle } from '../../rectangle';
import { faDrawPolygon } from '@fortawesome/free-solid-svg-icons';


export class ContentImage extends Shape implements IContextItem {

  container: Shape;
  private _ready = false;
  private _image: HTMLImageElement;
  private _context : any;
  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    stateName: string,
    protected content: string,
    private angle: number = 0) {
    super(id,
      top,
      left,
      width,
      height,
      stateName);

    this._image = new Image()
    this._image.onload = (() => this.imageReady());
    this._image.src = content;

    this.container = new Rectangle(id + "_containerRect", top, left, width, height, stateName);
  }

  DrawShape(context: any): void {

    this.container.Draw(context);
    context.drawImage(this._image, this.Left + 5, this.Top + 5, this.Width - 10, this.Height - 10);

  }

  protected SetContainerState(state: StateIndex) {
    this.container.SetState(state);
  }

  Draw(context: any): void {

    if (!this._ready) { 
      this._context = context;
      return; }
    this.DrawShape(context);
  }

  imageReady() {
    this._ready = true;
    this.Draw(this._context);
  }

  CopyShape(newID: string): Shape {

    return new ContentImage(newID, this.Top + 10, this.Left + 10, this.Width, this.Height, this.StateName, this.content, this.angle);
  }

  CopyItem(newID: string) {
    return this.CopyShape(newID);
  }

}
