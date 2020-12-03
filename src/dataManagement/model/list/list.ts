export enum ListType {
  SELECT = 0,
  CHECK = 1,
  RADIO = 2,
  TYPEAHEAD = 3
}

export interface IListItem {
  ID(): string;
  Order(): number;
  Content(): string;
  HasContent(content: string);
  CompareContent(content: string);
  CompareOrder(order: number);
}

export class ListItem implements IListItem {
  constructor(private _id: string, private _content: string, private _order: number = 0) { }

  ID() { return this._id; }
  Content() { return this._content; }
  Order() { return this._order; }
  HasContent(content: string) {
    return this._content.toLowerCase().includes(content.toLowerCase());
  }
  CompareContent(content: string) {
    return content > this._content ? 1 : -1;
  }
  CompareOrder(order: number) {
    return order > this._order ? 1 : -1;
  }
}

export class List extends ListItem {

  constructor(
    _name: string,
    _id: string,
    private listType: ListType = ListType.SELECT,
    private _items: IListItem[] = []) {
    super(_id, _name);
  }

  SortByContent() {
    this._items.sort(function (a, b) { return b.CompareContent(a.Content());})
  }

  SortByOrder() {
    this._items.sort(function (a, b) { return b.CompareOrder(a.Order()); })
  }

  AddItem(id: string, content: string, order: number = 0) {

    this._items.push(new ListItem(id, content,order));
  }

  AddNewContent(content: string) {
    let order = this._items.length;
    let id = '000';
    this.AddItem(id, content, order);
    this.SortByContent();
  }

  get Items(): IListItem[] {
    return this._items;
  }

  FilterContent(content: string): IListItem[]{
    return this._items.filter(i => i.HasContent(content));
  }

  IndexOfContent(content: string): number {
    return this._items.findIndex(i => i.Content() == content);
  }
}
