import { IIndexer, IIndexedItem } from '../Interface/IIndexer';

export class Indexer implements IIndexer {
  private _index = -1;
  private _count: number = 0;
  private _removedItems: IIndexedItem[] = [];
  constructor(protected _items: IIndexedItem[] = []) {
    this._count = this._items.length;
    this.Final();
  }
  
  Count(): number { return this._count; }
  SelectItemById(id: any): boolean {
    this._index = this._items.findIndex(i => i.SelectItemById(id));
    return this.ValidItem();
  };

  SelectItem(searchData: any): boolean {
    this._index = this._items.findIndex(i => i.SelectItem(searchData));
    return this.ValidItem();
  }

  FilteredItems(searchData: any = null): IIndexedItem[] {
    if (!searchData) {
      return this._items;
    }
    return this._items.filter(i => i.SelectItem(searchData));
  }
  ValidItem(): boolean {
    return (this._index >= 0 && this._index < this._count);
  }

  SelectedItem(): IIndexedItem {
    return (this.ValidItem) ? this._items[this._index] : null;
  }

  AddItem(item: IIndexedItem): boolean {
    if (item) {
      this._items.push(item);
      this._count = this._count + 1;
      this._index = this._count - 1;
      return true;
    }
    return false;
  }

  RemoveItem(): boolean {
    if (this.ValidItem()) {
      this._removedItems = this._removedItems.concat(this._items.splice(this._index, 1));
      this._count = this._items.length;
      if (this._index >= this._count) { this._index = this._count - 1; }
      return true;
    }
    return false;
  }

  First(): boolean { return this.Goto(0); }
  Final(): boolean { return this.Goto(this._count - 1); }
  NextBy(by: number = 1): boolean { return this.Goto(this._index + by); }
  BackBy(by: number = 1): boolean { return this.Goto(this._index - by); }
  Goto(index: number): boolean {
    if (index < 0) {
      this._index = 0;
      return false;
    }
    if (index >= this._count) {
      this._index = this._count - 1;
      return false;
    }
    this._index = index;
    return true;
  }
}
