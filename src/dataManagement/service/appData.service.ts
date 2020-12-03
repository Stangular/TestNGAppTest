import { Injectable } from '@angular/core';
import { DataHTTPService } from '../../dataManagement/service/dataHTTP.service';
import { AppDataModel, ListItem } from '../../dataManagement/model/data/appData.model';
//import { Http, Response } from '@angular/http';

@Injectable()
export class AppDataService {
    _appData: AppDataModel = new AppDataModel();
    
    constructor(public _httpService: DataHTTPService) {}
    
    GetList(listName: string): ListItem[] {
        let list = this._appData.Lists.find(l => l.listName == listName);
        if (!list || !list.items || list.items.length <= 0) {
            return [new ListItem(1, 0,'List not available')];
        }
        return list.items;
    }
     
    GetListIdFromName(listType: string, name: string): number {
        let list = this.GetList(listType);
        let item = list.find(i => i.label == name);
        return item ? item.id : -1;
    }

    GetListNameFromId(listType: string, id: number): string {
        let list = this.GetList(listType);
        let item = list.find(i => i.id == id);
        return item ? item.label : '';
    }

    HasContent(type: string) {
        //let list = this._appData.Lists.find(l => l.listName == type);
        //return (!!list && list.items.length > 0);
    }

    PromiseLoad(appName: string = ''): Promise<any> {
      let p = 'https://localhost:44336/api/data/lists';
      return this._httpService.startUpPromise(p).then(data => {
            if (data) {
                this._appData.SetLists(data);
                return data;
            } else { // id not found
                return false;
            }
        });
    }

    private load() {

        //this._httpService.getContent('AppData').subscribe(
        //    data => this.subscribeSuccess(data),
        //    err => this.subscribeError(err)
        //);
    }

    subscribeSuccess(data: any) {
        this._appData.SetLists(data);
    }


    subscribeError(data: any) {

    }

    //getList(listName: string) {
    //    let list = this._appData.Lists.find(l => l.listName == listName);
    //    if (!list) { return [] }
    //    return list.items;
    //}

}
