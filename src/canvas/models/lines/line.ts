//import { IShape } from '../shapes/Ishape';
//import { Shape } from '../shapes/shape';
import { Port } from '../shapes/port';
import { Point } from '../shapes/primitives/point';
import { IContextItem, ContextSystem } from '../IContextItem';
import { ILine } from './Iline'
import { DisplayValues, StateIndex, UIStates} from '../DisplayValues'
import { ShapeSelectResult } from '../shapes/shapeSelected';

export class Line implements IContextItem, ILine {

  _class: string = '';

  constructor(private id: string,
    protected sourceOffset: Point,
    protected targetOffset: Point,
    protected state: StateIndex) { }

  get Id() { return this.id; }

  public ReferencePorts(source: Port, target: Port) {
    this.sourceOffset = source.Offset;
    this.targetOffset = target.Offset;
  }

  get Class(): string {
    return this._class;
  }

  AssignToClass(clss: string): void {
    this._class = clss;
  }

  UpdateContextState() { }

  public DrawLine(context: any) {

    context.strokeStyle = DisplayValues.GetColor(this.state.Index[UIStates.color]);
    context.lineWidth = DisplayValues.GetWeight(this.state.Index[UIStates.weight]);

    this.moveToSource(context);
    this.lineToTarget(context);

  }

  CopyItem(newId: string) {
    return null;
  }

  Select(shapeSelectResult: ShapeSelectResult): boolean {
    return false;
  }

  protected moveToSource(context: any) {
    context.moveTo(this.sourceOffset.X, this.sourceOffset.Y);
  }

  lineToTarget(context: any) {
    context.lineTo(this.targetOffset.X, this.targetOffset.Y);
  }

  Draw(context: any): void {

    context.beginPath();

    this.DrawLine(context);
    context.stroke();

    context.closePath();
  }


  SelectShape(shapeSelectResult: ShapeSelectResult) {
    return false;
   // this.IsPointInShape(point);
  }
}
