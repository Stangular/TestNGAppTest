import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { PlaceService } from '../../services/place/place.service';
import { Place } from '../../models/Place/Place';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
@Component({
  selector: 'place-edit',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css']
})
export class PlaceComponent implements OnInit {
  pForm: FormGroup;
  parentPlace: Place;
  childPlace: Place;
  types: any[] = [];

  parentName = new FormControl();
  childName = new FormControl();
  placetype = new FormControl();

  parentItems: Observable<Place[]>;
  childItems: Observable<Place[]>;
  constructor(private _placeService: PlaceService,
    fb: FormBuilder) {
    this.pForm = fb.group({});
    //this.pForm = this._formBuilder.group({
    //  parentName: ["", [Validators.required]],
    //  childName: ["", [Validators.required]],
    //  placetype: ["", [Validators.required]]
    //});
    this.pForm = fb.group({});

  }

  ChildToParent() {
    if (!this.childPlace) {
      return;
    }
    this._placeService.MoveUp(this.parentPlace.ID);
    let place : any = this._placeService.APlace(this.childPlace.ID);
    this.parentPlace = place;
    this.childPlace = null;
    this.parentName.setValue(this.parentPlace.Name);
    this.childName.setValue('');
  }

  ParentToChild() {
    if (this._placeService.AtRoot) {
      return;
    }
    let childId = this.parentPlace.ID;
    let p : any = this._placeService.LastPlace;
    this.parentPlace = p;
    p = this._placeService.APlace(childId);
    this.childPlace = p;
    this._placeService.MoveDown();
    this.parentName.setValue(this.parentPlace.Name);
    this.childName.setValue(this.childPlace.Name);
  }

  ngOnInit() {
    this.parentItems = this.parentName.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterParent(value))
      );
    this.childItems = this.childName.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterChildren(value))
      );
    this._placeService.Load();
  }

  UpdatePlace() {
    this._placeService.UpdatePlace();
  }



  //get ParentName() {
  //  return this._formBuilder.control['parentName'].value
  //}
  //get ChildName() {
  //  return this._formBuilder.control['childName'].value
  //}
  //get ChildType() {
  //  return this._formBuilder.control['placetype'].value
  //}


  ParentClosed(option: any) {
    let sss = 0;
  }

  ParentSelected(option: any) {
    //   this.parentPlace = option.value as Place;
  }

  get Children() {
    //let parentName = this.pForm.controls['parentName'].value;
    //this._placeService.Children
    //let results = this._placeService.Children('1');
    return [];
  }

  private _filterChildren(value: string): Place[] {
    const v = value.toLowerCase();
    if (!this.parentPlace) {
      return [];
    }
    let id = this.parentPlace.ID;
    let list : any = this._placeService.Children(id).filter(option => option.Name.toLowerCase().indexOf(v) >= 0);
    if (list.length == 1) {
      let p: any = list[0];
      this.childPlace = p;
    }
    if (!list || list.length == 0) {
      return [];
    }
    return list;
  }

  SavePlace() {

  }

  private _filterParent(value: string): Place[] {
    const v = value.toLowerCase();
    let list : any = this._placeService
      .Parents
      .filter(option => option.Name.toLowerCase().indexOf(v) >= 0);
    if (list.length == 1) {
      let p: any = list[0];
      this.parentPlace = p;
      this.childName.setValue('');
    }
    if (!list || list.length == 0) {
      return [];
    }
    return list;
  }
}
