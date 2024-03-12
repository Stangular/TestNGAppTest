import { IShape, FreedomOfMotion, AreaType } from "../IShape";
import { ContextModel } from "src/canvas/component/context.model";
import { Shape } from "../shape";
import { StateIndex, DisplayValues, UIStates } from "../../DisplayValues";
import { Point } from "../primitives/point";
import { IContextItem } from "../../IContextItem";
import { MessageService } from 'src/app/messaging/message.service';
import { Size } from "../primitives/size";


export abstract class Content  {
  protected _stateIndex: StateIndex = null;

  constructor(protected id: string,
    protected stateName: string,
    protected hitStateName: string,
    protected content: string,
    protected fromSource: boolean = false,
    protected angle: number = 0) {
    
    this._stateIndex = DisplayValues.GetShapeIndex(this.stateName);
  }

  abstract Draw(context: CanvasRenderingContext2D, shape: IShape);
  abstract ContextInit(tx: CanvasRenderingContext2D, size: Size);
  abstract Update(content: any);

  get Id() { return this.id }
  get State() { return this.stateName; }
  get Content() { return this.content; }
  get Angle() { return this.angle; }
  get FromSource() { return this.fromSource; }
  get StateIndex() { return this._stateIndex; }

  Active(hit: boolean) {

    if (hit) { //touched
      this._stateIndex = DisplayValues.GetShapeIndex(this.hitStateName);
    }
    //else if (selected) {
    //  this._stateIndex = DisplayValues.GetShapeIndex(this.selectedStateName);
    //}
    else {
      this._stateIndex = DisplayValues.GetShapeIndex(this.stateName);
    }
  }
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
  _textWidth: number = 0;
  constructor(Id: string,
    stateName: string,
    hitStateName: string,
    content: string,
    fromSource: boolean = false,
    angle: number = 0) {
    super(Id,
      stateName,
      hitStateName,
      content,
      fromSource,
      angle);
  }

  ContextInit(ctx: CanvasRenderingContext2D, size: Size) {
    this.MeasureText(ctx, size.Height);
  };

  Update(content: any) { this.content = content.toString(); }
  
  MeasureText(ctx: CanvasRenderingContext2D, height: number): number {
    ctx.save();
    ctx.font = height + "px " + DisplayValues.GetFont(this.StateIndex.Index[UIStates.fontFace]);
    this._textWidth = ctx.measureText(this.Content).width;
    ctx.restore();
    return this._textWidth;
  }

  public Draw(ctx: CanvasRenderingContext2D, shape: IShape) {

 // console.error("Text: " + this.stateName + ":" + this.content);
 //   console.error("DRAW C: " + this.State + ":" + this.StateIndex.State + ":" + this.StateIndex.Index)

    let textWidth = this.MeasureText(ctx, shape.Height);
    //if (shape.Width <= textWidth) {
    //  shape.SizeBy(this, shape.Top, shape.Left + textWidth, shape.Bottom, shape.Left);
    //}
    //   shape.Draw(ctx);
    
    ctx.beginPath();
    ctx.save();

    ctx.translate(shape.Left, shape.Top);
    ctx.rotate(this.Angle * Math.PI / 180);
    //ctx.rect(0, 0, this.shape.Width, this.shape.Height);
    //ctx.fillStyle = DisplayValues.GetColor(this.shape.StateIndex.Index[UIStates.background]);
    //ctx.fill();
    //ctx.strokeStyle = DisplayValues.GetColor(this.shape.StateIndex.Index[UIStates.foreground]);

    ctx.font = ( shape.Height - 1) + "px " + DisplayValues.GetFont(this.StateIndex.Index[UIStates.fontFace]);
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'left';
    ctx.fillStyle = DisplayValues.GetFGColor(this.StateIndex.Index[UIStates.foreground]);
    ctx.textAlign = 'left';
    ctx.fillText(this.content, shape.Width / 2 - textWidth / 2, shape.Height);// Width calculation is to center the text in the area

  //  console.error("Draw Text:" + this.content + '_' + shape.Width + '_' + this.stateName);
  //  ctx.strokeStyle = 'transparent';
    //ctx.lineWidth = 1;
    //ctx.stroke();
    ctx.restore();
    ctx.closePath();
  }
}

export class ImageContent extends Content {
  private _image: any;
  private _ready;
  constructor(Id: string,
    stateName: string,
    hitStateName: string,
    content: string,
    shape: IShape,
    fromSource: boolean = false,
     angle: number = 0,
    protected imageIndex: number = 0) {
    super(Id,
      stateName,
      hitStateName,
      content,
      fromSource,
      angle);
    let self = this;
    this._image = new Image();
    this._image.onload = () => {
      setTimeout(() => self._ready = true, 0);
    }
    this._image.src = content;
  }

  ContextInit(tx: CanvasRenderingContext2D, size: Size) { }

  Update(content: any) { this._image.src = content.toString(); }

  public Draw(context: CanvasRenderingContext2D, shape: IShape) {
    if (!this._ready || !context) { return false; }
    context.drawImage(
      this._image,
      shape.Left + 5,
      shape.Top + 5,
      shape.Width - 10,
      shape.Height - 10);
    return true;
  }
}



