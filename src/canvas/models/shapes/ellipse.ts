import { Shape } from './shape';
import { IContextItem, ContextSystem } from '../IContextItem';
import { DisplayValues, StateIndex, UIStates } from '../DisplayValues'

export class Ellipse extends Shape implements IContextItem {

  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    stateName: string) {
    super(id,
      top,
      left,
      width,
      height,
      stateName);
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

  private DrawEllipse(context: any) {

    var width = this.Width / 2;
    var height = this.Height / 2;
    var centerX = this.Left + width;
    var centerY = this.Top + height;

    var i = 0;
    let xPos = this.getXPos(i, centerX, width, height);
    let yPos = this.getYPos(i, centerY, width, height);
    context.moveTo(xPos, yPos);

    for (i = 0.01; i < 2 * Math.PI; i += 0.01) {
      xPos = this.getXPos(i, centerX, width, height);
      yPos = this.getYPos(i, centerY, width, height);
      context.lineTo(xPos, yPos);
    }
  }

  DrawShape(context: any): void {

    if (this.StateIndex) {
      this.DrawEllipse(context);
      context.fillStyle = DisplayValues.GetColor(this.BackgroundColorIndex);
      context.fill();
      context.lineWidth = DisplayValues.GetWeight(this.StateIndex.Index[UIStates.weight]);
      context.strokeStyle = DisplayValues.GetColor(this.StateIndex.Index[UIStates.foreground]);
      context.stroke();

    }

  }

  Draw(context: any): void {

    context.beginPath();

    this.DrawShape(context);

    context.closePath();
  }

  CopyShape(newID: string): Shape {

    return new Ellipse(newID, this.Top + 10, this.Left + 10, this.Width, this.Height, this.StateName);
  }
  
  CopyItem(newID: string) {
    return this.CopyShape(newID);
  }
  //SelectShape(shapeSelectResult: ShapeSelectResult): boolean {
  //  return (this.Select(shapeSelectResult));
  //}
}
