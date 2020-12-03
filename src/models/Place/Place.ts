
export class Place {
  constructor(
    private _id: string,
    private _name: string,
    private _type: string,
    private _parentID: string,
    private _lat = 0.0,
    private _lon = 0.0,
    private _aka: string[] = []) { }

  SelectItemById(id: any): boolean { return this._id == <string>id; }
  SelectItem(searchData: any): boolean {
    return this.IsPlace(searchData as string);
  }
  get ID() { return this._id; }
  get Name() { return this._name; }
  get Parent() { return this._parentID; }
  get Type() { return this._type; }
  IsPlace(name: string): boolean {
    let n = name.toLowerCase();
    return this._name.toLowerCase() == n ||
      this._aka.findIndex(a => a.toLowerCase() == n) >= 0;
  }

  //AsTreeNode(): ITreeNode {
  //  return { id: this._id, name: this._name, children: []};
  //}

  get Latitude() {
    return this._lat;
  }

  get Longitude() {
    return this._lon;
  }
}
