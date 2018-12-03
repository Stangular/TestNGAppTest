import { IListNavigator } from '../list/ListNavigator';

export interface IDataItem<T> {
    ID(): T;
}

export abstract class DataItem<T> implements IDataItem<T> {

    constructor(private _ID: T) { }

    public ID(): T {
        return this._ID;
    }
}

export abstract class DataItems<T> extends DataItem<T> implements IListNavigator<T> {
    private _selectedItem: number;

    constructor(ID: T, protected _items: DataItem<T>[] = []) {
        super(ID);
        if (_items.length <= 0) {
            this.addDefaultItem();
        }
    }

    public get Count(): number {
        return this._items.length;
    }

    public ID(): T {
        return super.ID();
    }

    protected abstract addDefaultItem(): void;

    public AddItem(item: DataItem<T>) {
        this._items.push(item);
        this.Goto(this._items.length - 1);
    }

    public RemoveItem() {
        this._items = this._items.splice(this._selectedItem);
        if (this._items.length <= 0) {
            this.addDefaultItem();
        } else {
            this.Goto(this._items.length - 1);
        }
    }

    SelectedIndex(): number {
        return this._selectedItem;
    }

    protected Goto(value: number): boolean {
        this._selectedItem = -1;
        let c = this.Count - 1;
        if (value >= 0 && c >= 0 && value < c) {
            this._selectedItem = value;
            return true;
        }
        return false;
    }

    public First(): boolean {
        return this.Goto(0);
    }

    public Final(): boolean {
        return this.Goto(this.Count - 1);
    }

    public Next(): boolean {
        return this.Goto(this._selectedItem + 1);
    }

    public Previous(): boolean {
        return this.Goto(this._selectedItem - 1);
    }

    public SelectItem(ID: T): boolean {
        return this.Goto(this._items.findIndex(i => i.ID() === ID));
    }
}
