import { Place } from './Place';
import { PlaceType } from './PlaceType';
import { IFilter } from '../Interface/IFilter';


//export class ParentPlaceFilter implements IFilter {
//  _name: string = "filterOnParent";
//  _parentId: string = '';
//  filterAction(place: Place): boolean {
//    return place.Parent == this._parentId;
//  }
//  setFilter(data: any): void { this._parentId = data as string; }
//  filterName(): string { return this._name }
//}

export class Places extends Place {
  // _indexer: IIndexer;
  //_filters: IFilter[] = [];
  _placeTypes: PlaceType[] = [];
  _places: Place [] = [];
  constructor(
    id: string,
    name: string,
    type: string,
    parentID: string,
    lat = 0.0,
    lon = 0.0,
    aka: string[] = []) {
    super(id, name, type, parentID, lat, lon, aka);
    //   this._indexer = new Indexer(places);
    //this._filters.push(new ParentPlaceFilter());
  }

  //AsTreeFromRoot() {
  //  return this.AsTree(this.AsTreeNode());
  //}

  //AsTree(node: ITreeNode) {
  //  let placeNodes = this.FilteredItems(node.id);
  //  placeNodes.forEach(function (p, i) {
  //    node.children.push(p.AsTreeNode());
  //  });
  //  return node;
  //}

  // find all places with the same parent...

  AddPlace(id: string, name: string, type: string, parentID: string) {
    let parent = this._places.find(p => p.ID == parentID) || this;
    let placeType = this._placeTypes.find(t => t.Name == type);
    if (!placeType) {
      this._placeTypes.push(new PlaceType(type, parent.Type));
    }
    let place = this._places.find(p => p.Name == name && p.Parent == parentID);
    if (place) { //place already exists...
      return;
    }
    this._places.push(new Place(id, name, type, parent.ID));
  }
  // filtering
  //FilteredItems(filter: any): IIndexedItem[] { return this._indexer.FilteredItems(filter); }

  FilterByParentID(parentId: string): Place[] {
    return this._places.filter(p => p.Parent == parentId);
  }

  FindByID(id:string): Place {
    return this._places.find(p => p.ID == id);
  }

  //Count(): number { return this._places.Count(); }
  //SelectItemById(id: any): boolean { return this._indexer.SelectItemById(id); }
  //SelectItem(searchData: any): boolean { return this._indexer.SelectItemById(searchData); }

  //ValidItem(): boolean { return this._indexer.ValidItem(); }
  //SelectedItem(): any { return this._indexer.SelectedItem(); }
  //AddItem(item: any): boolean { return this._indexer.AddItem(item); }
  //RemoveItem(index: any): boolean { return this._indexer.RemoveItem(index); }
  //First(): boolean { return this._indexer.First(); }
  //Final(): boolean { return this._indexer.Final(); }
  //NextBy(by: number = 1): boolean { return this._indexer.NextBy(by); }
  //BackBy(by: number = 1): boolean { return this._indexer.BackBy(by); }
  //Goto(index: number): boolean { return this._indexer.Goto(index); }
}
