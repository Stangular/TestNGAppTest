export interface ITreeNode {
  id: string;
  name: string;
  children: ITreeNode[];
}

export interface IIndexedItem {
  SelectItemById(id: any): boolean;
  SelectItem(searchData: any): boolean;
}

export interface IIndexer {
  Count(): number;
  SelectItemById(id: any): boolean;
  SelectItem(searchData: any): boolean;
  FilteredItems(searchData: any): IIndexedItem[];
  ValidItem(): boolean;
  SelectedItem(): IIndexedItem;
  AddItem(item: IIndexedItem): boolean;
  RemoveItem(): boolean;
  First(): boolean;
  Final(): boolean;
  NextBy(by: number): boolean;
  BackBy(by: number): boolean;
  Goto(index: number): boolean;
}
