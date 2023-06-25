import {
  Component,
  AfterViewInit,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from 'src/models/navigation/navigationService';
import { ContextLayer } from 'src/canvas/models/IContextItem';
import { FamilyTreeModel, FamilyModel, PersonModel, Sex } from 'src/canvas/models/concepts/Family/familyTree/familyTree.model';
import { CanvasService } from 'src/canvas/service/canvas.service';
import { MatTabChangeEvent } from '@angular/material';


@Component({
  templateUrl: './MES.component.html',
  styleUrls: ['./MES.component.css']
})
export class MESComponent implements OnInit, AfterViewInit {
  sidePanelOpen: boolean = false;
  _timeLineType = 'timeline-year';
  family: FamilyTreeModel;

  constructor(private _navMan: NavigationService,
    public canvasService: CanvasService,
    private router: Router) { }

  ngOnInit() {
    this._navMan.SelectByName(this.router, "MES", this._navMan.Home);
  //  this.timeline = new TimeLineBaseLayerModel(new Date(), 16, 20, 10);

 //   let people: PersonModel[] = [];
    //people.push(new PersonModel('197182_0', Sex.Male, "Stanley"));
    //people.push(new PersonModel('197182_1', Sex.Male, "J.C."));
    //people.push(new PersonModel('197182_2', Sex.Male, "Joshua"));
    //people.push(new PersonModel('197182_3', Sex.Male, "William"));
    //people.push(new PersonModel('197182_4', Sex.Male, "John"));
    //people.push(new PersonModel('197182_5', Sex.Male, "John"));
    //people.push(new PersonModel('197182_6', Sex.Male, "John"));
    //people.push(new PersonModel('197182_7', Sex.Male, "Thomas"));
    //let f = new FamilyModel('197182', 'Shannon', 'R-Y34201', people);
  //  this.family = new FamilyTreeModel(f);
 }

  ngAfterViewInit(): void {
   
  }

  get Family(): ContextLayer {
    return this.family;
  }

  ChangeTab(tab: MatTabChangeEvent) {
    let sss = 0

  }

  setTimeLineType(event: any) {
    this._timeLineType = 'timeline-decade';
  }

  Toggle(sidePanel:any) {
    this.sidePanelOpen = !this.sidePanelOpen;
    sidePanel.toggle();
  }
}
