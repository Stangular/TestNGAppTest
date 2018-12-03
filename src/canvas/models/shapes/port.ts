import { IShape } from './IShape';
import { Point, TrackingPoint } from './point';
import { Shape } from './shape';
import { extend } from 'webdriver-js-extender';

export abstract class Port implements IShape {

  constructor(private shape: IShape, private offset: Point = shape.Center) {

  }

  DrawShape(context: any): void {
    this.shape.DrawShape(context);
  }

  get Id(): string { return this.shape.Id; }
  get Top(): number { return this.shape.Top + this.offset.Y; }
  get Right(): number { return this.shape.Right; }
  get Bottom(): number { return this.shape.Bottom; }
  get Left(): number { return this.shape.Left + this.offset.X; }

  get Width(): number { return this.shape.Width; }
  get Height(): number { return this.shape.Height; }

  get Center(): Point { return this.shape.Center; }

  get Offset(): Point {
    return this.offset;
  }
}
