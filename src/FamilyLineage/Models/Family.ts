import { Observable } from "rxjs";
import { DataModel, DataCollection } from "src/models/data/DataModel";
import { FormGroup, FormControl } from "@angular/forms";
import { HttpParams } from "@angular/common/http";

export class Notes {
  constructor(
    id: string,
    private note: string,
    private itemId:string) {

  }
}

export class Category {
  constructor(
    id: string,
    private category: string,
    private type: number) { }
}

export class Location {
  constructor(
    id: string,
    name: string,
    typeId: string,
    longitude: number,
    latitude: number,
    parentId:string) { }
}

export class Event {
  constructor(
    id: string,
    private when: Date,
    private locationId,
    private documentId,
    private personId,
    private typeId) { }

  get When() { return this.when; }
}

export class Person {
  constructor(
    id: string,
    private _name: string,
    private _familyId:string ) { }

  get Name() { return this._name; }


}

export class Family extends DataModel {

  constructor(
    id: string,
    private _surname: string) {
      super(id);
  }


  get Surname() { return this._surname; }

  

  SelectItem(searchData: any): boolean {
    return false;
    //if (searchData.surname) { this._selected = searchData.surname === this._surname; }
    //return this._selected;
  }

  protected GetParams(): HttpParams {
    return new  HttpParams()
    .set('familyId', this._id)
    .set('surname', this._surname);
  }

  protected PatchForm(formGroup: FormGroup): void {

  }
  
  protected Hydrate(data: any) {
    this._id = data.id;
    this._surname = data.surname;
  }

  public AddToForm(formGroup: FormGroup) : void {
    formGroup.addControl('surname', new FormControl());
  }
  //protected abstract PatchForm(formGroup: FormGroup): void;

}

export class Families { //extends DataCollection{

}
