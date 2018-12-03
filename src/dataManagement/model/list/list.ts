export enum ListType {
    SELECT = 0,
    CHECK = 1,
    RADIO = 2,
    TYPEAHEAD = 3
}

export interface IListItem {
    ID(): string;
    Content(): string;
}

export class ListItem implements IListItem {
    constructor(private _id: string, private _content: string) { }

    ID() { return this._id; }
    Content() { return this._content; }
}

export class List extends ListItem {

    constructor(
        _name: string,
        _id: string,
        private listType: ListType = ListType.SELECT,
        private _items: ListItem[] = []) {
        super(_id, _name);
    }

    AddItem(id: string, content: string) {
        this._items.push(new ListItem(id, content));
    }

    get Items(): IListItem[] {
        return this._items;
    }
}