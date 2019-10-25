import { Shape } from './shape';
import { IContextItem, ContextSystem } from '../IContextItem';
import { DisplayValues, StateIndex, UIStates } from '../DisplayValues'
import { ContextModel } from 'src/canvas/component/context.model';

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
      DisplayValueId: '',
      Ports: [],
      Shapes: [],
      Content: {}
    }
    this.Ports.forEach((p, i) => model.Ports.push(p.Save()));
    this.Shapes.forEach((s, i) => model.Shapes.push(s.Save()));
    return model;
  }

  Draw(context: ContextModel): void {

    context.DrawEllipse(this);
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
