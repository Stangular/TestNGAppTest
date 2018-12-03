import { IListItem, ListItem, List } from './list';

export class ListFactory extends List {
    _lists: List[] = [];
    constructor() {
        super('All Lists', 'ALL_LISTS');
    }

    public GetListItemContent(listName: string, listValue: string): string {
        let items = this.GetListItems(listName);
        let item = items.find(i => i.ID() === listValue);
        return item != null ? item.Content() : '';
    }

    public GetListItems(listName: string): IListItem[] {
        let items: IListItem[] = [];
        let list = this._lists.find(l => l.Content() === listName);

        /*   if (!list) {
               switch (listName) {
                   case 'DNA File Types': list = this.SetDNAFileTypes(); break;
               }
               this._lists.push(list);
           }*/

        return list ? list.Items : items;
    }

    get Items(): IListItem[] {
        let items: IListItem[] = [];
        this._lists.forEach(function (L, i) {
            items.push(new ListItem(L.Content(), L.Content()));
        });
        return items;
    }

    private initRemoteLists() {
        // read from external json file...
    }

    ID() { return 'All_Lists'; }
    Content() { return 'All Lists'; }
    /*
        private SetDNAFileTypes(): List {
            let list = new List('DNA List Types', 'DNA_LIST_TYPES');
            list.AddItem('0', 'Select...');
            list.AddItem(FileType.FTDNA_Match.toString(), 'FTDNA Matchs');
            list.AddItem(FileType.FTDNA_Segment.toString(), 'FTDNA Segments');
            list.AddItem(FileType.ANCESTRY_Match.toString(), 'Ancestry Match');
            return list;
        }
    */
};

export const _listFactory: ListFactory = new ListFactory();


