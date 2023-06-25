import { ContextLayer, IContextItem, IContextSystem, EventContextLayer } from "src/canvas/models/IContextItem";
import { Rectangle } from "src/canvas/models/shapes/rectangle";
import { DisplayValues, StateIndex } from "src/canvas/models/DisplayValues";
import { Ellipse } from "src/canvas/models/shapes/ellipse";
import { Port } from "src/canvas/models/shapes/port";
import { lineTypes } from "src/canvas/models/lines/line";
import { generate } from "rxjs";
import { TextContent, Content } from "src/canvas/models/shapes/content/Content";
import { ShapeContainer } from "src/canvas/models/shapes/shape";
import { IShape } from "src/canvas/models/shapes/IShape";
import { Point } from "src/canvas/models/shapes/primitives/point";

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

export class PersonArea extends Rectangle {

  constructor(
    private content: TextContent,
    id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    stateName: string = '',
    zIndex: number = 0) {
    super(id,
      top,
      left,
      width,
      height,
      stateName,
      zIndex);
 //   this._name = new TextContent(id + "_content", contentState, name, false, 0);
  }
  
  MeasureText(ctx: CanvasRenderingContext2D): number {
    return this.content.MeasureText(ctx, this.Height);
  }

  Draw(ctx: CanvasRenderingContext2D): void {
    super.Draw(ctx);
    this.content.Draw(ctx, this);
  }
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

  AddContent(contentName: string, parent: ContextLayer, parentArea: Rectangle, sz: number, offset: number, areaId: string ) {

 //   let personArea = new PersonArea(this.firstName, 'personData', areaId, 20, offset, sz, 20, 'personContainer');
    //parent.AddContent(personArea);

   // parent.AddText(personArea, this.firstName, 'personData', 'person', false);

   // if (generation > 0) {
     //   let ports = [];
   //   ports.push(port1.Center);
   //   ports.push(port2.Center);
  //    parent.AddPath(pathId, 'familyPath', ports);

   ////   parentArea.AddPort(p1);
   ////   parentArea.AddPort(p2);

   // }

   // parent.AddShape(personArea);

  }

  //InitializeContext(context: CanvasRenderingContext2D) {
    
  //}

}

export class FamilyModel implements IContextItem {

  protected _content: ShapeContainer = new ShapeContainer();

  constructor(
    private id: string,
    private surname: string = '',
    private yDNATerminalHaplogroup = '',
    private members: PersonModel[] = []) {
  }

  get Id() { return this.id; }
  get zIndex() { return 0; }

  Draw(context: any) {
    this._content.DrawContent(context);
  }

  CopyItem(newId: string): IContextItem {
    return null;
  }

  Save(): any {
    return '';
  }

  GetTouchedMember(point: Point): IShape {
    return this._content.RemoveItemAtPoint(point);
  }

  ReturnMember(member: IShape) {
    this._content.AddContent(member);
  }

  AddContent(ctx: CanvasRenderingContext2D, contentName: string, parent: ContextLayer, parentArea: Rectangle, sz: number, offset: number) {
    let width = sz;
    let self = this;
    let contents: TextContent[] = []
    let r = new Rectangle(contentName, 0, 10, sz, 20, 'FamilyName');
    parent.AddContent(r);
    parent.AddText(r, this.surname + " " + this.yDNATerminalHaplogroup, 'FamilyName', 'DefaultFG', false);
    let offsetx = 10;
    let generation = this.members.length - 1;
    let ports: Port[] = [];
    this.members.forEach(function (m, i) {// build content
      let content = new TextContent(m.Id + "_content", 'personData', m.FirstName, false, 0);
      let w = content.MeasureText(ctx, 20);
      if (w > width) {
        width = w;
      }
      contents.push(content);
    });
    width += 10;
    contents.forEach(function (c, i) { // build content area
      let cid = c.Id + "_area_gen_" + generation.toString();
      let personArea = new PersonArea(c, c.Id + "_area", 20, offsetx, width, 20, 'personContainer');
      self._content.AddContent(personArea);
      let pathId = 'familyTreePath_' + self.id + "_" + generation.toString();

      if (generation > 0) {
        let port1 = new Ellipse(pathId + "_A", 29, offsetx + width - 2, 4, 4, 'personPort1');

        ports.push(new Port("familyTreePath_A_" + generation, 0, 0, cid, 'familyPath', 'personPort1', port1, 0));
      }

      offsetx += (width + 20);

      if (generation > 0) {
        let port2 = new Ellipse(pathId + "_B", 29, offsetx - 2, 4, 4, 'personPort2');
        ports.push(new Port("familyTreePath_A_" + generation, 0, 0, cid, 'familyPath', 'personPort2', port2, 0));
      }

      generation--;
    });
    while (ports.length > 0 ) {
      parent.PortPath.AddPorts(ports.splice(0, 2));
    }
  }


}

export class FamilyTreeModel extends EventContextLayer {

  constructor(parentArea: Rectangle, private familyData: FamilyModel, context : CanvasRenderingContext2D) {

    super(parentArea,
      'familyTree'
      , 'familyTree'
      , 'xxx1sss'
      , new Date()
      , 'afadsf');

   // DisplayValues.Clear();
 
    //  this.GetContentItem
    //PortPath.
    //   this.Set();
    //   (<Rectangle>this.Content[0].).AddPort().
    this.Init(context);
  }

  Init(context: CanvasRenderingContext2D = null) {
    this.ClearContent(1);
    this.ClearPaths();
    this.AddLine("familyPath", "timeLineColor", lineTypes.straight);
    this.AddContent(new Rectangle('familyTree', 0, 0, this.ParentArea.Width, this.ParentArea.Height / 2, 'familyTree'));

    this.familyData.AddContent(context,'familydata', this, this.Content[0] as Rectangle, 100, 0);
  }
  LoadCanvasData(inputData: any): Promise<any>  { return null; }
  UpdateCanvasData(inputData: any) {}
  AutoUpdate(): boolean { return false; }

  GetContextData(): any {
    return null;
  }

  Draw(context: CanvasRenderingContext2D, initial: boolean = false) {
    this.ClearContext(context);
    this.familyData.Draw(context);
    //this.content.forEach(s =>
    //  (<Shape>s).Ports.forEach(p => this.DrawPortPath(context, p as Port)));
    this.DrawPortPath(context);

    if (initial) {
      this._tracker.Draw(context, true);
    }
  }

  GetTouchedShape(point: Point): IShape {

    return this.familyData.GetTouchedMember(point);

  }

  ReturnTouchedShape(shape: IShape) {
    this.familyData.ReturnMember(shape);
  }
}
