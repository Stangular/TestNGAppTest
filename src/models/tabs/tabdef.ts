export class TabDefinitionModel {

  constructor(
    private _label: string,
    private _icon: string,
    private _url: string,
    private _data: string = '') { }

  get Label() { return this._label; }
  get Icon() { return this._icon; }
  get URL() { return this._url; }
  get Data() { return this._data;}
}
