export class ListItem {

    constructor(public id: number, public value: number, public label: string) {

    }
}

export class List {
    constructor(public listName: string, public items: ListItem[] = []) { }

    AddListItem(id: number, value: number, label: string) {
        this.items.push(new ListItem(id, value, label));
    }
}


export class AppDataModel {

    public Lists: List[] = [];

    constructor() {

        //this.Lists.push({ name: 'roles', list: [] });
        //this.Lists.push({ name: 'credibility', list: [] });
        //this.Lists.push({ name: 'misinformation', list: [] });
        //this.Lists.push({ name: 'categories', list: [] });
        //this.Lists.push({
        //    name: 'userpermissions',
        //    list: [] = [
        //        new ListItem(1, 'Can View'),
        //        new ListItem(2, 'Can Edit'),
        //        new ListItem(3, 'Remove')
        //    ]
        //});
        //this.Lists.push({
        //    name: 'sourcetype',
        //    list: [] = [
        //        new ListItem(0, 'Source type A'),
        //        new ListItem(1, 'Source type B'),
        //        new ListItem(2, 'Source type C'),
        //        new ListItem(2, 'and so on...')
        //    ]
      //  });
    }

    public SetLists(data: { query: '', content: any[] }) {
        if (!data) { return; }
        let self = this;
        let listItems: { fieldID: '', values: string[] } = data.content.find(c => c.fieldID == "ListItem");
        let listNames: { fieldID: '', values: string[] } = data.content.find(c => c.fieldID == "ListName");
        let listValues: { fieldID: '', values: number[] } = data.content.find(c => c.fieldID == "ListValue");
        let listIds: { fieldID: '', values: number[] } = data.content.find(c => c.fieldID == "Id");

        listNames.values.forEach(function (listname, n) {

            let l = self.Lists.find(x => x.listName == listname);

            if (!l) {
                l = new List(listname);
                let list = listNames.values.filter(x => x == listname);
                for (let i = 0; i < list.length; i = i + 1) {
                    let x = n + i;
                    l.AddListItem(listIds.values[x], listValues.values[x], listItems.values[x]);
                }
                self.Lists.push(l);
          }
        });
    }
}
