import { ITerm, A_Term, A_Sequence } from './sequence';

export class SequenceFactory {
  _basicLists: A_Sequence<string,string,number>[] = [];
    constructor() {}

    //public GetListItemContent(listName: string, listValue: string): string {
    //    let items = this.GetListItems(listName);
    //    let item = items.find(i => i.ID() === listValue);
    //    return item != null ? item.Content() : '';
    //}

  //public GetListItems(listName: string): ITerm[] {
  //  let items: ITerm[] = [];
  //      let list = this._lists.find(l => l.Content() === listName);

  //      /*   if (!list) {
  //             switch (listName) {
  //                 case 'DNA File Types': list = this.SetDNAFileTypes(); break;
  //             }
  //             this._lists.push(list);
  //         }*/

  //      return list ? list.Items : items;
  //  }

  //get Items(): ITerm[] {
  //  let items: ITerm[] = [];
  //      this._lists.forEach(function (L, i) {
  //        items.push(new A_Term(L.Content(), L.Content()));
  //      });
  //      return items;
  //  }

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

export const _seqFactory: SequenceFactory = new SequenceFactory();


