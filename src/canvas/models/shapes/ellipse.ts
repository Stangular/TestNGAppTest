import { IShape } from './Ishape';
import { Shape } from './shape';
import { IContextItem, ContextSystem } from '../IContextItem';
import { DisplayValues, StateIndex, UIStates} from '../DisplayValues'
import { Point } from './primitives/point';
import { ShapeSelectResult } from './shapeSelected';

export class Ellipse extends Shape implements IContextItem {

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

    var width = this.Width / 2;
    var height = this.Height / 2;
    var centerX = this.Left + width;
    var centerY = this.Top + height;

    var i, xPos, yPos;
    for (i = 0 * Math.PI; i < 2 * Math.PI; i += 0.01) {
      xPos = centerX - (height * Math.sin(i)) * Math.sin(0 * Math.PI) + (width * Math.cos(i)) * Math.cos(0 * Math.PI);
      yPos = centerY + (width * Math.cos(i)) * Math.sin(0 * Math.PI) + (height * Math.sin(i)) * Math.cos(0 * Math.PI);
      if (i === 0) {
        context.moveTo(xPos, yPos);
      } else {
        context.lineTo(xPos, yPos);
      }
    }
    context.fillStyle = DisplayValues.GetColor(this.state.Index[UIStates.background]);
    context.fill();
    context.lineWidth = DisplayValues.GetWeight(this.state.Index[UIStates.weight]);
    context.strokeStyle = DisplayValues.GetColor(this.state.Index[UIStates.foreground]);
    context.stroke();
  }

  Draw(context: any): void {
   
    context.beginPath();

    this.DrawShape(context);

    context.closePath();
  }


  SelectShape(shapeSelectResult: ShapeSelectResult): boolean {
    return (this.Select(shapeSelectResult));
  }
}
