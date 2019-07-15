import { IShape } from '../shapes/Ishape';
import { Port } from '../shapes/port';
import { Point } from '../shapes/primitives/point';
import { IContextItem, ContextSystem } from '../IContextItem';
import { ILine } from './Iline';
import { Line, IPortPath } from './line';
import { DisplayValues, StateIndex } from '../DisplayValues';

//export class QuadraticLine implements IPortPath {

//  constructor(id: string,
//    protected sourceOffset: Point,
//    protected targetOffset: Point,
//    protected gradientPort: Port,
//    state: StateIndex) {
//    super(id, state);
//  }

//  lineToTarget(context: any) {

//   // context.quadraticCurveTo(
//    //  this.gradientPort.Offset.X, this.gradientPort.Offset.Y,
//    //  this.targetOffset.X, this.targetOffset.Y)
//  }

//}
