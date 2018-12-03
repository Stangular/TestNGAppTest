import { IShape } from './IShape';

export class Point {

  constructor(protected x: number = 0, protected y: number = 0) { }

  get X(): number { return this.x; }
  get Y(): number { return this.y; }

  Set(point: Point) {
    this.x = point.X;
    this.y = point.Y;
  }

  SetToCenter(shape: IShape, offsetX: number = 0, offsetY: number = 0) {

    this.x = shape.Width / 2 + shape.Left;
    this.y = shape.Height / 2 + shape.Top;
    this.x += offsetX;
    this.y += offsetY;

  }
}

export class TrackingPoint extends Point {

  constructor(x: number = 0, y: number = 0) { super(x, y); }

  SetTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
