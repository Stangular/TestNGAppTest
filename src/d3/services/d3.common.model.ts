export class Size {
  constructor(private _width: number,
    private _height) { }

  get Width(): number {
    return this._width;
  }

  get Height(): number {
    return this._height;
  }

  Set(w: number, h: number) {
    this._width = w;
    this._height = h;
  }
}

export class Margin {
  constructor(
    private _top: number,
    private _right: number,
    private _bottom: number,
    private _left: number) {

  }

  Set(top: number, right: number, bottom: number, left: number) {
    this._top = top;
    this._right = right;
    this._bottom = bottom;
    this._left = left;
  }
  get Top(): number {
    return this._top;
  }

  get Right(): number {
    return this._right;
  }

  get Bottom(): number {
    return this._bottom;
  }

  get Left(): number {
    return this._left;
  }
}

export class ValuePair {
  constructor(public _fieldID: string = '',
    public _value: number = 0) { }
}

export class D3ChartSectionModel {

  public Offset: number = 0;

  constructor(
    private _name: string,
    private _defaultcolor: string = '#000000',
    private _touchedcolor: string = '#ffffff',
    //   private _value: number = 0,
    private _values: ValuePair[] = []) { }


  get Name(): string {
    return this._name;
  }

  get DefaultColor(): string {
    return this._defaultcolor;
  }

  get TouchedColor(): string {
    return this._touchedcolor;
  }

  FieldValue(fldID: string = ''): number {
    console.error(fldID);
    let v = this._values.find(x => x._fieldID == fldID);
    if (!v) {
      if (fldID.length > 0) { return 0; }
      console.error("C1:" + this._values[0]._value);
      return this._values[0]._value;
    }
    console.error("C2:" + v._value);

    return v._value;
  }

  Value(fieldID: string): number {
    let vlu = this._values.find(v => v._fieldID == fieldID);
    return (vlu) ? vlu._value : 0;
  }

  ResetValue(fieldID: string, value: number = 0) {
    let vlu = this._values.find(v => v._fieldID == fieldID);
    if (vlu) {
      vlu._value = (value >= 0) ? value : 0;
    }
  }
}

export class D3ChartModel {

  constructor(private _chartID: string, private _sections: D3ChartSectionModel[]) {

  }

  public TotalFieldValue(fieldID: string = ''): number {
    let totval = 0;
    this._sections.forEach(function (v, i) { totval += v.FieldValue(fieldID); });
    return totval;
  }

  ResetSectionValue(sectionName: string, fieldID: string, value: number) {

    let section = this._sections.find(s => s.Name == sectionName);
    if (section) {
      section.ResetValue(fieldID, value);
    }
  }

  get Sections() {
    return this._sections;
  }

  get ChartID() {
    return this._chartID;
  }



}

