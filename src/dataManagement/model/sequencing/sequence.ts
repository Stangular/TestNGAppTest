import { IElementDefinition, ElementModel, EditElementDefinition, ElementFilter, SortOrder } from "../definitions/ElementDefinition";
import { IValidator } from "../definitions/Validation";
import { modelGroupProvider } from "@angular/forms/src/directives/ng_model_group";

export interface ITerm<T, U, V> {
  ID(): T;
  Content(): U;
  Order(): V;
  HasContent(content: ITerm<T, U, V>);
  CompareContent(term: ITerm<T, U, V>);
  CompareOrder(order: V);
  Select();
  UnSelect();
  ToggleSelect();
  SelectByID(id: T);
  SelectByContent(content: U);
  Selected: boolean;
}

export class A_Term<T, U, V> implements ITerm<T, U, V> {
  constructor(
    private _id: T,
    private _content: U,
    private _order: V = null,
    private _selected: boolean = false) { }

  ID() { return this._id; }
  Content() { return this._content; }
  Order() { return this._order; }

  Select() {
    this._selected = true;
  }

  UnSelect() {
    this._selected = false;
  }

  ToggleSelect() {
    this._selected = !this._selected;
  }

  SelectByID(id: T) {
    this._selected = this._id === id;
    return this.Selected;
  }

  SelectByContent(content: U) {
    this._selected = this._content === content;
    return this.Selected;
  }

  get Selected() {
    return this._selected;
  }

  HasContent(term: ITerm<T, U, V>) {
    return this.AsLower().includes(this.AsLower(term.Content()));
  }

  AsString(value: U = null) {
    if (!value) { value = this._content; }
    return value.toString();
  }

  AsLower(value: U = null) {
    if (!value) { value = this._content; }
    return this.AsString(value).toLocaleLowerCase();
  }

  CompareContent(term: ITerm<T, U, V>): number {
    return this.AsLower(term.Content()) > this.AsLower() ? 1 : -1;
  }

  CompareOrder(order: V) {
    if (!this._order) { return 1; }
    return order > this._order ? 1 : -1;
  }
}
// T is the ID type of the term (usually string)
// U is the type of the data
// V is the Type of the ordering required (usually numeric)
export class A_Sequence<T, U, V> extends A_Term<number, string, number> implements IElementDefinition{

  private _element: IElementDefinition;

  constructor(
    elemName: string,
    elemId: number,
    modelId: number,
    label: string = '',
    id: number,
    name: string,
    private observable: boolean = true,
    private _items: ITerm<T, U, V>[] = []) {
    super(id, name);
    this._element = new EditElementDefinition<string>(elemName, elemId, modelId,label,name);
  }

  get Label() { return this._element.Label; }
  Clone(elmName: string, elmId: number): IElementDefinition {
    return this._element.Clone(elmName,elmId);
  }
  

  get Observable(): boolean {
    return this.observable;
  }
  
  SortByContent() {
    this._items.sort(function (a, b) { return b.CompareContent(a); })
  }

  SortByOrder() {
    this._items.sort(function (a, b) { return b.CompareOrder(a.Order()); })
  }

  AddItem(id: T, content: U, order: V = null) {

    this._items.push(new A_Term<T, U, V>(id, content, order));
  }

  AddNewContent(id: T, content: U, order: V = null) {
    this.AddItem(id, content, order);
    this.SortByContent();
  }
  get Count(): number {
    return this._items.length;
  }
  get Items(): ITerm<T, U, V>[] {
    return this._items;
  }

  IndexOfContent(term: ITerm<T, U, V>): number {
    return this._items.findIndex(i => i.Content() == term.Content());
  }

  get ElementID() { return this._element.ElementID; }
  get ElementName() { return this._element.ElementName; }
  get EditMode(): boolean { return this._element.EditMode; }
  get ModelID(): number { return this._element.ModelID; }
  //  InvalidValue(): T;
  InitialValue() { return this._element.InitialValue(); }
  CurrentValue() { return this._element.CurrentValue(); }

  init() { return this._element.init(); }
  get IsDirty() { return this._element.IsDirty; }
  Clean() { return this._element.Clean(); }
  ResetToDefault(defaultValue: any) { return this._element.ResetToDefault(defaultValue); }
  SetInitialValue(v: U) { this._element.SetInitialValue(v); }
  UpdateCurrentValue(v: U, validator: IValidator[]) {
    let r = this._element.UpdateCurrentValue(v, validator);
    if( r && r.valid )
    {
      this._items.forEach(i => i.SelectByContent(this._element.CurrentValue()));
    }
    return r;
  }

  UpdateFromUI(validator: IValidator[] = [] ) { return this._element.UpdateFromUI(validator); }
}
