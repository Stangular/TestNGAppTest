import { ContextLayer, IContextItem, IContextSystem } from "src/canvas/models/IContextItem";
import { Rectangle } from "src/canvas/models/shapes/rectangle";
import { DisplayValues } from "src/canvas/models/DisplayValues";
import { Ellipse } from "src/canvas/models/shapes/ellipse";
import { Port, ePortType } from "src/canvas/models/shapes/port";
import { lineTypes } from "src/canvas/models/lines/line";
import { generate } from "rxjs";

export class Citation {
  private _citation: string = '';

}

export class Document {
  constructor(private discription: '',
    private imagePath: '',
    private citation: Citation) { }


}

export class Event {
  constructor(private _when: Date,
    private _what: string = '',
    private _document: Document = null) { }

  get When() { return this._when; }
  get What() { return this._what; }
  get Document() { return this._document; }
  get IsDocumented() { return this._document != null; }
}

export enum Sex {
  Male = 0,
  Female = 1
}

export class PersonModel implements IContextItem {

  constructor(
    private id: string,
    private sex: Sex = Sex.Male,
    private firstName: string = '',
    private middleNames: string = '',
    private aka: string[] = [],
    private events: Event[] = []) { }

  get Id() { return this.id; }

  Draw(contextModel) {

  }

  get zIndex() { return 0; }

  CopyItem(newId: string): IContextItem {
    return null;
  }

  Save(): any {
    return '';
  }

  get FirstName() { return this.firstName; }
  get MiddleNames() { return this.middleNames; }
  get AKA() { return this.aka; }
  Event(what: string) { return this.events.find(e => e.What.toLocaleLowerCase() == what.toLocaleLowerCase()); }

  AddContent(contentName: string, parent: ContextLayer, parentArea: Rectangle, sz: number, offset: number, generation: number = 0) {

    let personArea = new Rectangle(this.Id + '_area', 20, offset, sz, 30, 'personData');
    parent.AddContent(personArea);
    parent.AddText(this.firstName, 'personData', 'personFG', false);

    if (generation > 0) {
      let pathId = 'familyTreePath_' + this.id + "_" + generation.toString();
      let port1 = new Ellipse(pathId + "_A", personArea.Center.Y, personArea.Right, 1, 1, 'DefaultBG');
      let p1 = new Port("familyTreePath_A_" + this.id, 0, 0, port1, ePortType.source, 'DefaultBG', pathId, 0);
      let port2 = new Ellipse(pathId + "_B", personArea.Center.Y, personArea.Right + sz - 0.5, 1, 1, 'DefaultBG');
      let p2 = new Port("familyTreePath_B_" + this.id, 0, 0, port2, ePortType.target, 'DefaultBG', pathId, 1);
      let ports = [];
      ports.push(port1.Center);
      ports.push(port2.Center);
      parent.AddPath(pathId, 'familyPath', ports);

      parentArea.AddPort(p1);
      parentArea.AddPort(p2);

    }

    parent.AddShape(personArea);

  }
}

export class FamilyModel implements IContextItem {
  constructor(
    private id: string,
    private surname: string = '',
    private yDNATerminalHaplogroup = '',
    private members: PersonModel[] = []) {
  }

  get Id() { return this.id; }
  get zIndex() { return 0; }

  Draw(contextModel) {

  }

  CopyItem(newId: string): IContextItem {
    return null;
  }

  Save(): any {
    return '';
  }

  AddContent(contentName: string, parent: ContextLayer, parentArea: Rectangle, sz: number, offset: number) {
    parent.AddContent(new Rectangle(contentName, 0, 10, sz, 20, 'FamilyName'));
    parent.AddText(this.surname + " " + this.yDNATerminalHaplogroup, 'FamilyName', 'DefaultFG', false);
    let offsetx = 10;
    let generation = this.members.length - 1;
    this.members.forEach(function (m, i) {
      m.AddContent(contentName + "_" + i.toString(), parent, parentArea, 50, offsetx, generation);
      offsetx += 100;
      generation--;
    });
  }
}

export class FamilyTreeModel extends ContextLayer {

  constructor(parentArea: Rectangle, private familyData: FamilyModel) {

    super(parentArea,
      'familyTree'
      , 'familyTree'
      , 'xxx1sss'
      , new Date()
      , 'afadsf'
      , [new Rectangle('familyTree', 0, 0, -1, 80, 'familyTree')]);

   // DisplayValues.Clear();
 
    //  this.GetContentItem
    //PortPath.
    this.AddLine("familyPath", "timeLineColor", lineTypes.straight);
    //   this.Set();
    //   (<Rectangle>this.Content[0].).AddPort().

  }

  Init() {
    this.ClearContent(1);
    this.ClearPaths();
    this.familyData.AddContent('familydata', this, this.Content[0] as Rectangle, 50, 0);
  }
}
