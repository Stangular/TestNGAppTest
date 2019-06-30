import { IShape } from '../shapes/Ishape';
import { Port } from '../shapes/port';
import { Point } from '../shapes/primitives/point';
import { IContextItem, ContextSystem } from '../IContextItem';
import { ILine } from './Iline';
import { Line } from './line';
import { DisplayValues, StateIndex } from '../DisplayValues';

export class BezierLine extends Line implements IContextItem {


  constructor(id: string,
    protected bezierport: Port,
    protected gradientPort: Port,
    state: StateIndex) {
    super(id, state);
  }
  
  lineToTarget(context: any) {

   // context.bezierCurveTo(
   //   this.bezierport.Offset.X, this.bezierport.Offset.Y,
   //   this.gradientPort.Offset.X, this.gradientPort.Offset.Y,
 //     this.targetOffset.X, this.targetOffset.Y);
  }
}
