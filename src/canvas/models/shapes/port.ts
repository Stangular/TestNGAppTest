import { IShape } from './IShape';
import { Point, TrackingPoint } from './primitives/point';
import { Shape } from './shape';
import { extend } from 'webdriver-js-extender';
import { Ellipse } from './ellipse';
import { StateIndex } from '../DisplayValues';
import { Size } from 'src/d3/services/d3.common.model';
import { IContextItem } from '../IContextItem';

export class Port implements IShape, IContextItem {

  internalShape: Shape;
  private _parentShapeId: string = '';
 

  constructor(private id: string,
    offsetX: number,
    offsetY: number,
    parent: Shape,
    state: StateIndex) {

    let x = parent.Center.X + ( parent.Width / 2 ) * (offsetX / 100);
    let y = parent.Center.Y + ( parent.Height / 2 ) * (offsetY / 100);
    this.internalShape = new Ellipse(id + "_*", 0,0, 5, 5, state);
    this.internalShape.CenterOn(x, y);
    this.parentShapeId = parent.Id;
  }

  DrawSource(context: any) {
    context.moveTo(this.internalShape.Center.X, this.internalShape.Center.Y);
  }

  DrawTarget(context: any) {
    context.lineTo(this.internalShape.Center.X, this.internalShape.Center.Y);
  }

  DrawShape(context: any): void {
    // get line moveto/lineto
    this.internalShape.Draw(context);
  }

  MoveBy(x: number, y: number) {
    this.internalShape.MoveBy(x, y);
  }

  get ParentShapeId() {
    return this._parentShapeId;
  }
  SizeBy(top: number, right: number, bottom: number, left: number) {
    let w = (right - left) / 2;
    let h = ( bottom - top ) / 2;
    let cx = left + w;
    let cy = top + h;
    let x = cx + w * (this.internalShape.Center.X / 100);
    let y = cy + h * (this.internalShape.Center.Y / 100);
    this.internalShape.CenterOn(x, y);
  }
  get Id(): string { return this.id; }
  get Top(): number { return this.internalShape.Top}
  get Right(): number { return this.internalShape.Right; }
  get Bottom(): number { return this.internalShape.Bottom; }
  get Left(): number { return this.internalShape.Left; }

  get Width(): number { return this.internalShape.Width; }
  get Height(): number { return this.internalShape.Height; }

  get Center(): Point { return this.internalShape.Center; }

  get Offset(): Point {
    return this.offset;
  }

  get InternalShape() { return this.internalShape; }
}
