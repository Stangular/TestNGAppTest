import { Shape } from './shape';
import { IContextItem, ContextSystem } from '../IContextItem';
import { DisplayValues, StateIndex, UIStates } from '../DisplayValues'
import { Point } from './primitives/point';
import { ShapeSelectResult } from './shapeSelected';

export class Rectangle extends Shape {

  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    state: StateIndex) {
    super(id,
      top,
      left,
      width,
      height,
      state);
  }

  DrawShape(context: any): void {

    context.rect(this.Left, this.Top, this.Width, this.Height);
    context.fillStyle = DisplayValues.GetColor(this.BackgroundColorIndex);
    context.fill();
    context.lineWidth = DisplayValues.GetWeight(this.state.Index[UIStates.weight]);
    context.strokeStyle = DisplayValues.GetColor(this.state.Index[UIStates.foreground]);
    context.stroke();
  }

  Draw(context: any): void {
    context.beginPath();
    this.DrawShape(context);
    this._shapes.forEach(s => s.DrawShape(context));
    this._ports.forEach(p => p.DrawShape(context));
    context.closePath();
  }

  CopyShape(newID: string ) : Shape {

    return new Rectangle(newID, this.Top + 10, this.Left + 10, this.Width, this.Height, this.state );
  }

  CopyItem(newID: string) {
    return this.CopyShape(newID);
  }
  //SelectShape(shapeSelectResult: ShapeSelectResult): boolean {
  //  return (this.SelectShape(shapeSelectResult));
  //}
}

export class RoundedRectangle extends Shape implements IContextItem {


  constructor(id: string,
    top: number,
    right: number,
    bottom: number,
    left: number,
    state: StateIndex) {
    super(id,
      top,
      right,
      bottom,
      left,
      state);
  }

  DrawShape(context: any): void {

    context.rect(this.Left, this.Top, this.Width, this.Height);
    context.fillStyle = DisplayValues.GetColor(this.state.Index[UIStates.background]);
    context.fill();
    context.lineWidth = DisplayValues.GetWeight(this.state.Index[UIStates.weight]);
    context.strokeStyle = DisplayValues.GetColor(this.state.Index[UIStates.foreground]);
    context.stroke();
  }

  CopyShape(newID: string): Shape {

    return new Rectangle(newID, this.Top + 10, this.Left + 10, this.Width, this.Height, this.state);
  }

  CopyItem(newID: string) {
    return this.CopyShape(newID);
  }

  Draw(context: any): void {
    //var cornerRad = shape.cornerRadius;
    //if (cornerRad <= 0) {
    //  drawRectangle(context, shape);
    //  return;
    //}
    //var pt = shape.position; //applyPointAdjustment(shape.position, DisplayState.GetWidth(shape.borderState));
    //if ((cornerRad * 2) > shape.size.W) { cornerRad = (shape.size.W / 2) - 2; }// When the shape size gets smaller than the rounded corners allow, we reduce the cornerradius.
    //if ((cornerRad * 2) > shape.size.H) { cornerRad = (shape.size.H / 2) - 2; }
    //var x2 = pt.X + shape.size.W;
    //var y2 = pt.Y + shape.size.H;


    //context.beginPath();
    //var pathSegment = { Points: [], color: DisplayState.GetColor(shape.borderState), width: DisplayState.GetWidth(shape.borderState), CornerRadius: cornerRad };
    //pathSegment.Points.push({ X: pt.X + cornerRad, Y: pt.Y });
    //pathSegment.Points.push({ X: x2 - cornerRad, Y: pt.Y, X2: x2, Y2: pt.Y, qX: x2, qY: pt.Y + cornerRad });
    //pathSegment.Points.push({ X: x2, Y: y2 - cornerRad, X2: x2, Y2: y2, qX: x2 - cornerRad, qY: y2 });
    //pathSegment.Points.push({ X: pt.X + cornerRad, Y: y2, X2: pt.X, Y2: y2, qX: pt.X, qY: y2 - cornerRad });
    //pathSegment.Points.push({ X: pt.X, Y: pt.Y + cornerRad - (DisplayState.GetWidth(shape.borderState) / 2), X2: pt.X, Y2: pt.Y, qX: pt.X + cornerRad, qY: pt.Y });
    //drawQuadraticPathSegment(context, pathSegment);

    //context.fillStyle = DisplayState.GetColor(shape.state);
    //context.fill();
    //context.stroke();
  }
}
