export class Size {

  constructor(protected width: number = 0, protected height: number = 0) { }

  get Width(): number { return this.width; }
  get Height(): number { return this.height; }

  Set(size: Size) {
    this.width = size.Width;
    this.height = size.Height;
  }
}
