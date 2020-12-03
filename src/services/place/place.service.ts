import { Injectable } from '@angular/core';
import { PlaceType } from '../../models/place/PlaceType';
import { Place } from '../../models/place/Place';
import { Places } from '../../models/place/Places';
import { DataHTTPService } from 'src/dataManagement/service/dataHTTP.service';
import { ITreeNode  } from '../../models/Interface/IIndexer';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  _placePath: string[] = [];

  private _places: Places = new Places('0', 'earth', null, '');
  constructor(private _http: DataHTTPService) {
    this._places.AddPlace('1', 'USA', 'Nation', '0');
    this._places.AddPlace('2', 'UK', 'Nation', '0');
    this._places.AddPlace('3', 'Indiana', 'State', '1');
    this._places.AddPlace('4', 'Oklahoma', 'State', '1');
    this._places.AddPlace('5', 'Washita', 'County', '4');
    this._places.AddPlace('6', 'Custer', 'County', '4');
    this._places.AddPlace('7', 'Kiowa', 'County', '4');
    this._places.AddPlace('8', 'Henry', 'County', '3');
    this._places.AddPlace('9', 'Marion', 'County', '3');
    this._places.AddPlace('10', 'Madison', 'County', '3');
    this._placePath.push(this.APlace().ID);
  }

  Success(data: any) {
    let sss = 0;
  }

  Fail(error: any) {

  }

  //get PlaceTree() {
  //  return this._places.AsTreeFromRoot();
  //}

  Load() {
    this._http.getContent("something").subscribe(
      data => { this.Success(data) },
      err => { this.Fail(err) });
  }

  UpdatePlace() {}
  get PathNames() {
    let path = '*';
    for (let i = 1; i < this._placePath.length; i = i + 1) {
      let p = this.APlace(this._placePath[i]);
      path += '/';
      path += p.Name;
    }
    return path;
  }

  APlace(placeId: string = ''): Place {
    return this._places.FindByID(placeId) || this._places;
  }

  get LastPlace(): Place {
    let index = this._placePath.length - 1;
    if (index <= 0) {
      return this._places;
    }
    return this.APlace(this._placePath[index]);
  }

  Root(): Place[] { return this._places.FilterByParentID('0') as Place[]; }

  Children(parentID: string): Place[] {
    return this._places.FilterByParentID(parentID) as Place[];
  }

  Add() { }
  Select() { }
  get AtRoot() {
    return this._placePath.length <= 1;
  }

  MoveDown() {
    if (this._placePath.length == 1) {
      return false;
    }
    this._placePath.pop();
    return true;
  }

  MoveUp(ID: string) {
    if (this._placePath.findIndex(p => p == ID) >= 0) {
      return false;
    }
    this._placePath.push(ID);
    return true;
  }

  get Parents() {
    let id = this._placePath[this._placePath.length - 1];
    let results = this.Children(id);
    return results;
  }
}
