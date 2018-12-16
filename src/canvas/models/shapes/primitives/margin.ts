export class Margin {

  constructor(private top: number, private left: number,
              private right: number, private bottom: number ) { }

  get Top(): number { return this.top; }
  get Left(): number { return this.left; }
  get Right(): number { return this.right; }
  get Bottom(): number { return this.bottom; }

}
