import { Shape } from './shape';
import { IContextItem, ContextSystem } from '../IContextItem';
import { DisplayValues, StateIndex, UIStates } from '../DisplayValues'
import { Point } from './primitives/point';
import { ShapeSelectResult } from './shapeSelected';
import { Port } from './port';
import { Path } from '../lines/path';
import { ContextModel } from 'src/canvas/component/context.model';


export class Rectangle extends Shape {

  protected _roundedCorners: number = 0;

  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    stateName: string = '',
    zIndex: number = 0) {
    super(id,
      top,
      left,
      width,
      height,
      stateName,
      zIndex);
  }

  Draw(ctx: CanvasRenderingContext2D): void {

    ctx.beginPath();
    ctx.rect(this.Left, this.Top, this.Width, this.Height);
    ctx.fillStyle = DisplayValues.GetColor(this.StateIndex.Index[UIStates.background]);
    ctx.fill();
    ctx.lineWidth = DisplayValues.GetWeight(this.StateIndex.Index[UIStates.weight]);
  //  ctx.strokeStyle = DisplayValues.GetColor(this.StateIndex.Index[UIStates.foreground]);
   // ctx.stroke();

    ctx.closePath();


  }

  Save(): any {
    let model = {
      Id: this.Id,
      Top: Math.ceil(this.Top),
      Left: Math.ceil(this.Left),
      Width: Math.ceil(this.width),
      Height: Math.ceil(this.height),
      Type: 0,
      CornerRadius: 0,
      Shadow: 0,
      DisplayValueId: this.StateName,
      Ports: [],
      Shapes: [],
      Content: {}
    }
    this.Ports.forEach((p, i) => model.Ports.push(p.Save()));
   // this.Contents.forEach((s, i) => model.Shapes.push(s.Shape.Save()));
    return model;
  }

  ShapeType(): number {
    return 0;
  }

  CopyShape(newID: string): Shape {

    return new Rectangle(newID, this.Top + 10, this.Left + 10, this.Width, this.Height, this.StateName);
  }

  CopyItem(newID: string) {
    return this.CopyShape(newID);
  }

  ResetArea(left: number, top: number, width: number, height: number) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
  }
  //SelectShape(shapeSelectResult: ShapeSelectResult): boolean {
  //  return (this.SelectShape(shapeSelectResult));
  //}
}

export class GradientRectangle extends Rectangle {

  private _gradient: CanvasGradient;

  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    stateName: string = '',
    zIndex: number = 0) {
    super(id,
      top,
      left,
      width,
      height,
      stateName,
      zIndex);
  }

  Draw(ctx: CanvasRenderingContext2D): void {

    let ga = DisplayValues.GetGradientArea(this.StateIndex.Index[UIStates.gradientArea]);
    let c1 = DisplayValues.GetColor(this.StateIndex.Index[UIStates.background]);
    let c2 = DisplayValues.GetGradientColor(this.StateIndex.Index[UIStates.gradientColor]);
    let x1 = this.Left; //+ (this.Left * 0.5);
    let x2 = this.Right; // + (this.Right * 0.5);
    let gradient = ctx.createLinearGradient(x1 , 0, x2, 0);
    gradient.addColorStop(1, c1);
    gradient.addColorStop(.5, c2);
    gradient.addColorStop(.5, c2);
    gradient.addColorStop(0, c1 );

    ctx.beginPath();
    ctx.rect(this.Left, this.Top, this.Width, this.Height);
    ctx.fillStyle = gradient;
    ctx.fill();
    //ctx.lineWidth = DisplayValues.GetWeight(this.StateIndex.Index[UIStates.weight]);
    //ctx.strokeStyle = DisplayValues.GetFGColor(this.StateIndex.Index[UIStates.foreground]);
    //ctx.stroke();

    ctx.closePath();

  }
}


//export class RoundedRectangle extends Shape implements IContextItem {


//  constructor(id: string,
//    top: number,
//    right: number,
//    bottom: number,
//    left: number,
//    stateName: string) {
//    super(id,
//      top,
//      right,
//      bottom,
//      left,
//      stateName);
//  }

//  DrawShape(context: any): void {

//    context.rect(this.Left, this.Top, this.Width, this.Height);
//    context.fillStyle = DisplayValues.GetColor(this.StateIndex.Index[UIStates.background]);
//    context.fill();
//    context.lineWidth = DisplayValues.GetWeight(this.StateIndex.Index[UIStates.weight]);
//    context.strokeStyle = DisplayValues.GetColor(this.StateIndex.Index[UIStates.foreground]);
//    context.stroke();
//    this.DrawContent(context);

//  }

//  CopyShape(newID: string): Shape {

//    return new Rectangle(newID, this.Top + 10, this.Left + 10, this.Width, this.Height, this.StateName);
//  }

//  CopyItem(newID: string) {
//    return this.CopyShape(newID);
//  }

//  Draw(context: any): void {
//    //var cornerRad = shape.cornerRadius;
//    //if (cornerRad <= 0) {
//    //  drawRectangle(context, shape);
//    //  return;
//    //}
//    //var pt = shape.position; //applyPointAdjustment(shape.position, DisplayState.GetWidth(shape.borderState));
//    //if ((cornerRad * 2) > shape.size.W) { cornerRad = (shape.size.W / 2) - 2; }// When the shape size gets smaller than the rounded corners allow, we reduce the cornerradius.
//    //if ((cornerRad * 2) > shape.size.H) { cornerRad = (shape.size.H / 2) - 2; }
//    //var x2 = pt.X + shape.size.W;
//    //var y2 = pt.Y + shape.size.H;


//    //context.beginPath();
//    //var pathSegment = { Points: [], color: DisplayState.GetColor(shape.borderState), width: DisplayState.GetWidth(shape.borderState), CornerRadius: cornerRad };
//    //pathSegment.Points.push({ X: pt.X + cornerRad, Y: pt.Y });
//    //pathSegment.Points.push({ X: x2 - cornerRad, Y: pt.Y, X2: x2, Y2: pt.Y, qX: x2, qY: pt.Y + cornerRad });
//    //pathSegment.Points.push({ X: x2, Y: y2 - cornerRad, X2: x2, Y2: y2, qX: x2 - cornerRad, qY: y2 });
//    //pathSegment.Points.push({ X: pt.X + cornerRad, Y: y2, X2: pt.X, Y2: y2, qX: pt.X, qY: y2 - cornerRad });
//    //pathSegment.Points.push({ X: pt.X, Y: pt.Y + cornerRad - (DisplayState.GetWidth(shape.borderState) / 2), X2: pt.X, Y2: pt.Y, qX: pt.X + cornerRad, qY: pt.Y });
//    //drawQuadraticPathSegment(context, pathSegment);

//    //context.fillStyle = DisplayState.GetColor(shape.state);
//    //context.fill();
//    //context.stroke();
//  }

