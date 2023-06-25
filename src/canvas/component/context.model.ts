import { Shape } from "../models/shapes/shape";
//import { ImageShape } from "../models/shapes/content/image/image";
import { IContextItem } from "../models/IContextItem";
import { IShape } from "../models/shapes/IShape";
//import { TextShape } from "../models/shapes/content/text/text";
import { StateIndex, UIStates, DisplayValues } from "../models/DisplayValues";
import { PortPath, lineTypes } from "../models/lines/line";
import { Point } from "../models/shapes/primitives/point";
import { ILine } from "../models/lines/ILine";
import { MessageService } from 'src/app/messaging/message.service';
import { TextContent } from "../models/shapes/content/Content";

// Add display state object
export class LayerContext {

  constructor(
    private name: string = '',
    private context: CanvasRenderingContext2D) { }

  setContext(ctx: CanvasRenderingContext2D) {
    this.context = ctx;
  }
  get Name() { return this.name; }
  get Context() { return this.context; }

}

export class ImageModel {

  private _image: HTMLImageElement;
  private _ready: boolean = false;
  constructor(private imageName: string
    , private path: string = '../images/'
    , messageService: MessageService) {
    this._image = new Image();
    this._image.src = "";
    let self = this;

    this._image.onload = () => {
      self._ready = true;
      setTimeout(() => messageService.sendMessage(1015), 0);
    }
    this._image.src = this.path + this.imageName;

  }

  get ImageName() {
    return this.imageName;
  }

  DisplayImage(ctx: CanvasRenderingContext2D, shape: Shape) {
    if (!this._ready || !ctx) { return false; }
    ctx.drawImage(
      this._image,
      shape.Left + 5,
      shape.Top + 5,
      shape.Width - 10,
      shape.Height - 10);
    return true;
  }
}

export class ContextModel {
 // _imagePath: string = '../images/';
 
//  private _images: ImageModel[] = [];

  constructor( private _context: CanvasRenderingContext2D ) { }

  //get CurrentLayerName() {
  //  if (this._currentLayer < 0) { return ''; }
  //  return this._context[this._currentLayer].Name;
  //}

  //SelectLayer(layerName: string) {
  //  this._currentLayer = this._context.findIndex(c => c.Name == layerName);
  //}

  //ClearCurrentLayer() {

  //  let ctx = this._context[this._currentLayer].Context;
  //  if (ctx) {
  //    let c = ctx.canvas;
  //    ctx.clearRect(0, 0, c.width, c.height);
  //    return true;
  //  }
  //  return false;
  //}

  //ClearLayer(layerId: string) {
  //  let index = this._context.findIndex(c => c.Name == layerId);
  //  if (index < 0) { return false; }
  //  let ctx = this._context[index].Context;
  //  if (ctx) {
  //    let c = ctx.canvas;
  //    ctx.clearRect(0, 0, c.width, c.height);
  //    return true;
  //  }
  //  return false;
  //}

  //RemoveAllContext() {
  //  this._context = [];
  //}

  //AddLayerContext(layername: string, context: CanvasRenderingContext2D) {
  //  this.SetLayerContext(layername, context);
  //  if (this._currentLayer < 0) {
  //    this._currentLayer = this._context.length;
  //    this._context.push(new LayerContext(layername, context));
  //  }
  //}

  //SetLayerContext(layername: string, ctx: CanvasRenderingContext2D) {
  //  this._currentLayer = this._context.findIndex(c => c.Name == layername);
  //  if (ctx != null && this._currentLayer >= 0) {
  //    return this._context[this._currentLayer].setContext(ctx);
  //  }
  //}

  //AddImage(imageName: string, messageService: MessageService): number { 
  //  let ndx = this._images.findIndex(i => i.ImageName == imageName);
  //  if (ndx >= 0) { return ndx; }
  //  ndx = this._images.length;
  //  let img = new ImageModel(imageName, this._imagePath, messageService);
  //  this._images.push(img);
  //  return ndx;
  //}

  DrawImage(shape: Shape, imageIndex: number = 0): boolean {
    if (!shape) { return false; }
    if (imageIndex < 0) { return false; }
    //let img = this._images[imageIndex];
   // if (!img) { return false; }
  //  let ctx = this._context[this._currentLayer].Context;

    return false; //img.DisplayImage(this._context, shape);
  }

  DrawText(content: TextContent, shape: Shape) {

    let ctx = this._context;

    if (!ctx) { return; }
    ctx.beginPath();
    ctx.save();
    if (shape.Width <= 0) {
      let w = this.MeasureText(content.Content, shape.Height, content.StateIndex);
      shape.SizeBy(this, shape.Top, shape.Left + w, shape.Bottom, shape.Left);
    }
    ctx.translate(shape.Left, shape.Top);
    ctx.rotate(content.Angle * Math.PI / 180);
    ctx.rect(0, 0, shape.Width, shape.Height);
    ctx.fillStyle = DisplayValues.GetColor(shape.StateIndex.Index[UIStates.background]);
    ctx.fill();
  //  ctx.strokeStyle = DisplayValues.GetColor(content.StateIndex.Index[UIStates.foreground]);

    ctx.font = shape.Height + "px " + DisplayValues.GetFont(content.StateIndex.Index[UIStates.fontFace]);
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'left';
    ctx.fillStyle = DisplayValues.GetFGColor(content.StateIndex.Index[UIStates.foreground]);
    ctx.textAlign = 'left';
    ctx.fillText(content.Content, 0, shape.Height);
    ctx.strokeStyle = 'transparent';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
    ctx.closePath();
  }

  MeasureText(text: string, height: number, state: StateIndex): number {
    let ctx = this._context; // this._context[this._currentLayer].Context;
    ctx.save();
    ctx.font = height + "px " + DisplayValues.GetFont(state.Index[UIStates.fontFace]);
    let width = ctx.measureText(text).width;
    ctx.restore();
    return width;
  }

  DrawRectangle(shape: IShape) {
    let ctx = this._context;// [this._currentLayer].Context;
    if (!ctx) { return; }
    ctx.beginPath();
    ctx.rect(shape.Left, shape.Top, shape.Width, shape.Height);
    ctx.fillStyle = DisplayValues.GetColor(shape.StateIndex.Index[UIStates.background]);
    ctx.fill();
    ctx.lineWidth = DisplayValues.GetWeight(shape.StateIndex.Index[UIStates.weight]);
    ctx.strokeStyle = DisplayValues.GetColor(shape.StateIndex.Index[UIStates.foreground]);
    ctx.stroke();

    ctx.closePath();

  }

  private getXPos(i: number, centerX: number, width: number, height: number) {
    return centerX
      - (height * Math.sin(i)) * Math.sin(0 * Math.PI)
      + (width * Math.cos(i)) * Math.cos(0 * Math.PI);
  }

  private getYPos(i: number, centerY: number, width: number, height: number) {
    return centerY
      + (width * Math.cos(i)) * Math.sin(0 * Math.PI)
      + (height * Math.sin(i)) * Math.cos(0 * Math.PI);

  }

  DrawEllipse(shape: IShape) {
    let ctx = this._context; // [this._currentLayer].Context;
    if (!ctx) { return; }
    ctx.beginPath();
    var width = shape.Width / 2;
    var height = shape.Height / 2;
    var centerX = shape.Left + width;
    var centerY = shape.Top + height;

    var i = 0;
    let xPos = this.getXPos(i, centerX, width, height);
    let yPos = this.getYPos(i, centerY, width, height);
    ctx.moveTo(xPos, yPos);

    for (i = 0.01; i < 2 * Math.PI; i += 0.01) {
      xPos = this.getXPos(i, centerX, width, height);
      yPos = this.getYPos(i, centerY, width, height);
      ctx.lineTo(xPos, yPos);
    }

    ctx.fillStyle = DisplayValues.GetColor(shape.StateIndex.Index[UIStates.background]);
    ctx.fill();
    ctx.lineWidth = DisplayValues.GetWeight(shape.StateIndex.Index[UIStates.weight]);
    ctx.strokeStyle = DisplayValues.GetColor(shape.StateIndex.Index[UIStates.foreground]);
    ctx.stroke();

    ctx.closePath();

  }

  DrawLine(line: ILine, ports: Point[]) {
    if (ports.length <= 0) { return; }

    let ctx = this._context;// [this._currentLayer].Context;
    if (!ctx) { return; }
    ctx.beginPath();

    switch (line.Type) {
      case lineTypes.gradient: this.DrawGradientPath(ports, ctx); break;
      case lineTypes.bezier: this.DrawBezierPath(ports, ctx); break;
      case lineTypes.VtoV: this.DrawVerticalToVerticalLine(ports, ctx); break;
      case lineTypes.VtoH: this.DrawVerticalToHorizontal(ports, ctx); break;
      case lineTypes.HtoH: this.DrawHorizontalToHorizontal(ports, ctx); break;
      case lineTypes.HtoV: this.DrawHorizontalToVertical(ports, ctx); break;
      default: this.DrawStraightLine(ports, ctx); break;
    }
    ctx.strokeStyle = DisplayValues.GetColor(line.State.Index[UIStates.color]);
    ctx.lineWidth = DisplayValues.GetWeight(line.State.Index[UIStates.weight]);
    ctx.stroke();
    ctx.closePath();

  }

  DrawVerticalToVerticalLine(ports: Point[], ctx: CanvasRenderingContext2D) {
    ctx.moveTo(ports[0].X, ports[0].Y);
    let p: number = 0;
    for (let j = 1; j < ports.length; j = j + 1) {
      let k = j - 1;
      p = ports[k].X + ((ports[j].X - ports[k].X) / 2);
      ctx.lineTo(p, ports[k].Y);
      ctx.lineTo(p, ports[j].Y);
      ctx.lineTo(ports[j].X, ports[j].Y);
    }
  }

  DrawHorizontalToHorizontal(ports: Point[], ctx: CanvasRenderingContext2D) {
    ctx.moveTo(ports[0].X, ports[0].Y);
    let p: number = 0;
    for (let j = 1; j < ports.length; j = j + 1) {
      let k = j - 1;
      p = ports[k].Y + ((ports[j].Y - ports[k].Y) / 2);
      ctx.lineTo(ports[k].X, p);
      ctx.lineTo(ports[j].X, p);
      ctx.lineTo(ports[j].X, ports[j].Y);
    }  
  }

  DrawVerticalToHorizontal(ports: Point[], ctx: CanvasRenderingContext2D) {
    ctx.moveTo(ports[0].X, ports[0].Y);
    for (let j = 1; j < ports.length; j = j + 1) {
      ctx.lineTo(ports[j].X, ports[j-1].Y);
      ctx.lineTo(ports[j].X, ports[j].Y);
    }
  }

  DrawHorizontalToVertical(ports: Point[], ctx: CanvasRenderingContext2D) {
    ctx.moveTo(ports[0].X, ports[0].Y);
    for (let j = 1; j < ports.length; j = j + 1) {
      ctx.lineTo(ports[j - 1].X, ports[j].Y);
      ctx.lineTo(ports[j].X, ports[j].Y);
    }
  }

  DrawStraightLine(ports: Point[], ctx: CanvasRenderingContext2D) {
    ctx.moveTo(ports[0].X, ports[0].Y);
    for (let j = ports.length - 1; j > 0; j = j - 1) {
      ctx.lineTo(ports[j].X, ports[j].Y);
    }
  }

  DrawGradientPath(ports: Point[], ctx: CanvasRenderingContext2D) {
    //if (ports.length < 3) {
    //  this.DrawStraightLine(ports, ctx);
    //  return;
    //}
    ctx.moveTo(ports[0].X, ports[0].Y);
    for (let j = 1; j < ports.length; j = j + 1) {
      let k = j - 1;
      ctx.quadraticCurveTo(
        ports[k].X + ports[k].X / 2, ports[k].Y - 10,
        ports[j].X, ports[j].Y);
    }
  }

  DrawBezierPath(ports: Point[], ctx: CanvasRenderingContext2D) {

    ctx.moveTo(ports[0].X, ports[0].Y);

    for (let j = 1; j < ports.length; j = j + 1) {
      let k = j - 1;
      let dx = (ports[j].Y - ports[k].Y) / 2;
      let dy = (ports[j].X - ports[k].X) / 4;
      ctx.bezierCurveTo(
        ports[j].X - dx, ports[k].Y + dx,
        ports[j].X + dy, ports[k].Y - dy,
        ports[j].X, ports[j].Y);
    }

  }

}
