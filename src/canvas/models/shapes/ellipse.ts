import { Shape } from './shape';
import { IContextItem, ContextSystem } from '../IContextItem';
import { DisplayValues, StateIndex, UIStates } from '../DisplayValues'
import { ContextModel } from 'src/canvas/component/context.model';

export class Ellipse extends Shape {

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

  Save(): any {
    let model = {
      Id: this.Id,
      Top: Math.ceil(this.Top),
      Left: Math.ceil(this.Left),
      Width: Math.ceil(this.width),
      Height: Math.ceil(this.height),
      Type: 1,
      CornerRadius: 0,
      Shadow: 0,
      DisplayValueId: this.StateName,
      Ports: [],
      Text: [],
      Images: [],
      Shapes: [],
      Content: {}
    }
    this.Ports.forEach((p, i) => model.Ports.push(p.Save()));
   // this.Contents.forEach((s, i) => model.Text.push(s.Shape.Save()));
    return model;
  }

  Draw(ctx: CanvasRenderingContext2D): void {

    ctx.beginPath();
    var width = this.Width / 2;
    var height = this.Height / 2;
    var centerX = this.Left + width;
    var centerY = this.Top + height;

    var i = 0;
    let xPos = this.getXPos(i, centerX, width, height);
    let yPos = this.getYPos(i, centerY, width, height);
    ctx.moveTo(xPos, yPos);

    for (i = 0.01; i < 2 * Math.PI; i += 0.01) {
      xPos = this.getXPos(i, centerX, width, height);
      yPos = this.getYPos(i, centerY, width, height);
      ctx.lineTo(xPos, yPos);
    }

    ctx.fillStyle = DisplayValues.GetColor(this.StateIndex.Index[UIStates.background]);
    ctx.fill();
    //ctx.lineWidth = DisplayValues.GetWeight(this.StateIndex.Index[UIStates.weight]);
    //ctx.strokeStyle = DisplayValues.GetColor(this.StateIndex.Index[UIStates.foreground]);
    //ctx.stroke();

    ctx.closePath();  }

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
