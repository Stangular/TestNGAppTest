import { Size } from './size';
import { Point } from './point';

export class Area {

  constructor(private point: Point, private size: Size) { }

  get Point() { return this.point; }
  get Size() { return this.size; }

  get Left(): number { return this.point.X; }
  get Top(): number { return this.point.Y; }
  get Width(): number { return this.size.Width; }
  get Height(): number { return this.size.Height; }
  get Bottom(): number { return this.size.Height - this.point.Y; }
  get Right(): number { return this.size.Width - this.point.X; }
  Set(area: Area) {
    this.point.Set(area.Point);
    this.size.Set(area.Size);
  }
}
