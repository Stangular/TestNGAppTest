
export class PlaceType {
  constructor(private _name: string, private parentType: string) { }

  get Name() { return this._name; }
  get Parent() { return this.parentType; }
}
