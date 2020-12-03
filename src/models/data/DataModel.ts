import { HttpClient } from "selenium-webdriver/http";
import { HttpModel } from "./HttpModel";
import { takeUntil } from 'rxjs/operators';
import { Observable } from "rxjs";
import { ResponseModel } from "./ResponseModel";
import { ErrorModel } from "./ErrorModel";
import { HttpParams } from "@angular/common/http";
import { IIndexer, IIndexedItem } from "../Interface/IIndexer";
import { Indexer } from "../Indexing/Indexer";
import { FormGroup } from "@angular/forms";


export abstract class DataModel implements IIndexedItem {

  protected httpParams: HttpParams = new HttpParams();
  protected apiEndPoint: string = '';
  protected errorMessage: string = '';
  protected complete: boolean = false;

  constructor(protected _id: string) { }


  get ID() { return this._id; }
  SelectItemById(id: any): boolean { return id === this._id; }

  protected abstract Hydrate(data: any);
  protected abstract GetParams(): HttpParams;
  public abstract AddToForm(formGroup: FormGroup): void;
  protected abstract PatchForm(formGroup: FormGroup): void;
  public abstract SelectItem(searchData: any): boolean;

  loadData(http: HttpModel, ngUnsubsribe: Observable<any>) {
    http.get(this.apiEndPoint, this.GetParams())
      .pipe(takeUntil(ngUnsubsribe))
      .subscribe(
        data => { this.LoadSuccess(data) },
        err => { this.SubscribeError(err) });
  }

  protected LoadSuccess(response: ResponseModel) {
    this.errorMessage = response.errorMessage;
    if (response.isStringified) {
      let result = JSON.parse(response.requestedResult);
      this.Hydrate(result);
    }
    else {
      this.Hydrate(response.requestedResult);
    }
  }

  protected SubscribeError(err: ErrorModel) {
    this.errorMessage = err.errorMessage;
  }
  get Error(): any { return this.errorMessage; }
}

export abstract class DataCollection extends DataModel implements IIndexer {

  private _indexer: Indexer;
  
  protected Hydrate(data: any) {
    let x = this._indexer;
    data.forEach(function (d, i) {
      x.AddItem(this.GetModel(d));
    });
  }
  protected abstract GetParams(): HttpParams;
  protected abstract GetModel(data: any): DataModel;
  public abstract GetFormGroup(): FormGroup;
  public abstract GetFieldNames(): string [];
  public abstract GetFieldLabels(): string[];

  constructor(id:string) {
    super(id);
    this._indexer = new Indexer();
  }
  // Indexer Methods...
  Count(): number { return this._indexer.Count() };
  SelectItemById(id: any): boolean { return this._indexer.SelectItemById(id) };
  SelectItem(searchData: any): boolean { return this._indexer.SelectItem(searchData) };
  ValidItem(): boolean { return this._indexer.ValidItem() };
  SelectedItem(): IIndexedItem { return this._indexer.SelectedItem() };
  FilteredItems(filter: any): IIndexedItem[] { return this._indexer.FilteredItems(filter) };
  AddItem(item: IIndexedItem): boolean { return this._indexer.AddItem(item) };
  RemoveItem(): boolean { return this._indexer.RemoveItem() };
  First(): boolean { return this._indexer.First() };
  Final(): boolean { return this._indexer.Final() };
  NextBy(by: number): boolean { return this._indexer.NextBy(by) };
  BackBy(by: number): boolean { return this._indexer.BackBy(by) };
  Goto(index: number): boolean { return this._indexer.Goto(index) };
}

