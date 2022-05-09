import { IShape, FreedomOfMotion, AreaType } from "../IShape";
import { ContextModel } from "src/canvas/component/context.model";
import { Shape } from "../shape";
import { StateIndex, DisplayValues, UIStates } from "../../DisplayValues";
import { Point } from "../primitives/point";
import { IContextItem } from "../../IContextItem";

export abstract class Content {
  protected _stateIndex: StateIndex = null;

  constructor(protected id: string,
    protected stateName: string,
    protected content: string,
    protected fromSource: boolean = false,
    protected angle: number = 0) {
    this._stateIndex = DisplayValues.GetShapeIndex(this.stateName);

  }

  abstract Draw(context: CanvasRenderingContext2D, shape: Shape);
  abstract Update(content: any);

  get Id() { return this.id }
  get State() { return this.stateName; }
  get Content() { return this.content; }
  get Angle() { return this.angle; }
  get FromSource() { return this.fromSource; }
  get StateIndex() { return this._stateIndex; }

}
export interface IDynamicContent<T> {
  Update(content: T);
}

//export abstract class DynamicContent extends Content implements IShape {
//  constructor(protected shape: IShape,
//    Id: string,
//    stateName: string,
//    content: string,
//    fromSource: boolean = false,
//    angle: number = 0) {
//    super(Id,
//      stateName,
//      content,
//      fromSource,
//      angle);
//  }

//  abstract Draw(context: CanvasRenderingContext2D);
//  abstract Update(content: any);
//  get Top(): number { return this.shape.Top; }
//  get Right(): number { return this.shape.Right; }
//  get Bottom(): number { return this.shape.Bottom; }
//  get Left(): number { return this.shape.Left; }
//  get Width(): number { return this.shape.Width; }
//  get Height(): number { return this.shape.Height; }
//  get Center(): Point { return this.shape.Center; }
//  get IsHit(): boolean { return this.shape.IsHit; }
//  get StateName(): string { return this.shape.StateName; }
//  get AreaType(): AreaType { return this.shape.AreaType; }
//  get FreedomOfMotion(): FreedomOfMotion { return this.shape.FreedomOfMotion; }
//  get FreedomOfSizing(): FreedomOfMotion { return this.shape.FreedomOfSizing; }

//  //DrawShape(context: any);
//  MoveBy(x: number, y: number) { this.shape.MoveBy(x,y); }
//  SizeBy(context: any, top: number, right: number, bottom: number, left: number)
//  { this.SizeBy(context, top, right, bottom, left); }
//  CenterOn(x: number, y: number) { this.shape.CenterOn(x,y); }
//  SetProperties(properties: any) { this.shape.SetProperties(properties); }
//  Select(criteria: any): boolean { return this.shape.Select(criteria); }
//  get StateIndex(): StateIndex { return this.shape.StateIndex; }
//  get Ports(): IShape[] { return this.shape.Ports; }
//  CopyItem(newId: string): IContextItem { return null; }
//  Save(): any { return this.shape.Save() };


//}

export class TextContent extends Content {
  constructor(Id: string,
    stateName: string,
    content: string,
    fromSource: boolean = false,
    angle: number = 0) {
    super(Id,
      stateName,
      content,
      fromSource,
      angle);
  }

  Update(content: any) { }

  MeasureText(ctx: CanvasRenderingContext2D, height: number, state: StateIndex): number {
    ctx.save();
    ctx.font = height + "px " + DisplayValues.GetFont(state.Index[UIStates.fontFace]);
    let width = ctx.measureText(this.Content).width;
    ctx.restore();
    return width;
  }

  public Draw(ctx: CanvasRenderingContext2D, shape: Shape) {

    ctx.beginPath();
    ctx.save();
    if (shape.Width <= 0) {
      let w = this.MeasureText(ctx, shape.Height, this.StateIndex);
      shape.SizeBy(this, shape.Top, shape.Left + w, shape.Bottom, shape.Left);
    }
    ctx.translate(shape.Left, shape.Top);
    ctx.rotate(this.Angle * Math.PI / 180);
    ctx.rect(0, 0, shape.Width, shape.Height);
    ctx.fillStyle = DisplayValues.GetColor(shape.StateIndex.Index[UIStates.background]);
    ctx.fill();
    //  ctx.strokeStyle = DisplayValues.GetColor(content.StateIndex.Index[UIStates.foreground]);

    ctx.font = shape.Height + "px " + DisplayValues.GetFont(this.StateIndex.Index[UIStates.fontFace]);
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'left';
    ctx.fillStyle = DisplayValues.GetFGColor(this.StateIndex.Index[UIStates.foreground]);
    ctx.textAlign = 'left';
    ctx.fillText(this.Content, 0, shape.Height);
    ctx.strokeStyle = 'transparent';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
    ctx.closePath();  }
}

export class ImageContent extends Content {
  constructor( Id: string,
     stateName: string,
    content: string,
    fromSource: boolean = false,
     angle: number = 0,
    protected imageIndex: number = 0) {
    super(Id,
      stateName,
      content,
      fromSource,
      angle);
      
  }

  Update(content: any) { }

  public Draw(context: CanvasRenderingContext2D, shape: Shape) {
    if (!shape) { return false; }
    //  if (imageIndex < 0) { return false; }
    //let img = this._images[imageIndex];
    // if (!img) { return false; }
    //  let ctx = this._context[this._currentLayer].Context;

    return false; //img.DisplayImage(this._context, shape);  }
  }

  get ImageIndex() {
    return this.imageIndex;
  }
}



