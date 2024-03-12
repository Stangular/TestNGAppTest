import { ContextLayer, IContextItem, IContextSystem, EventContextLayer, ITracker, MousePosition, IDataResult } from "src/canvas/models/IContextItem";
import { Rectangle } from "src/canvas/models/shapes/rectangle";
import { DisplayValues, StateIndex } from "src/canvas/models/DisplayValues";
import { Ellipse } from "src/canvas/models/shapes/ellipse";
import { Port } from "src/canvas/models/shapes/port";
import { lineTypes, PathLink, PortPath, Line } from "src/canvas/models/lines/line";
import { generate } from "rxjs";
import { TextContent, Content } from "src/canvas/models/shapes/content/Content";
import { ShapeContainer, PathShape, Shape, ShapePathContainer } from "src/canvas/models/shapes/shape";
import { IShape, IShapeContainer, FreedomOfMotion } from "src/canvas/models/shapes/IShape";
import { Point } from "src/canvas/models/shapes/primitives/point";
import { PathService } from "src/canvas/models/shapes/service/path.service";
import { AreaSizer } from "src/canvas/models/shapes/sizing/sizer";

// names
// {'ID': 'id', 'culture': 'xxx', name: []}

// citations
// {'ID': 'id', 'author': [], 'title': 'yyy', 'date': new Date('2014-03-01T08:00:00Z'), 'version':'xxx', publisher:'', Location:'' }

//Author. Title of Source. Title of Container, Other Contributors, Version, Number, Publisher, Publication date, Location.
export class Citation {
  private _citation: string = '';

}
// documents
//
// {'ID': 'id', 'discription': 'xxx', notes:[], 'imagePath': 'yyy', 'Citation': 'cid', },
export class Document {
  constructor(private discription: '',
    private imagePath: '',
    private citation: Citation) { }
}

// scores:
// { 'userID':'','eid':'', 'score':0, 'explanation': '' }
// events:
// {'ID': 'id', 'when': new Date('2014-03-01T08:00:00Z'), 'what': 'something', 'where':'', 'document': 'did', scores:[]},

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

export class PersonArea extends PathShape {

  constructor(
    private content: TextContent,
    protected ports: IShape[] = [],
    protected internalShape: IShape) {
    super(ports, internalShape);

  }

  HitTest(point: Point): boolean {
    this.content.Active(super.HitTest(point));
    return this.IsHit;
  }

  ClearHit() {
    super.ClearHit();
    this.content.Active(false);
  }

  GetName() {
    if (!this.content) {
      return "Empty person content";
    }
    return this.content.Content;
  }
  MeasureText(ctx: CanvasRenderingContext2D): number {
    return this.content.MeasureText(ctx, this.Height);
  }

  Draw(ctx: CanvasRenderingContext2D): void {
    super.Draw(ctx);
    this.content.Draw(ctx, this);
  }

  public DrawPartial(context: any) {
    super.DrawPartial(context);
    this.content.Draw(context, this);
  }
}
// parentchild
//{ 'ID':'', 'name': '', 'pid': ''}
// commondnaSegments
// {'ID': 'id', 'offset1': 0, 'offset2': 0, commonPeople:[], commonLocations:[] }
// people
// {'ID': 'id', 'name': Name, 'sex': '', 'events': [], 'familyID':'fid', 'motherID': 'mid', 'fatherID': 'fid' }

export class PersonModel {

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

  AddContent(contentName: string, parent: ContextLayer, parentArea: Rectangle, sz: number, offset: number, areaId: string) {

  }
}
// Families:
// {'ID': 'id', 'surname': '', 'termHG': '' }

export class FamilyModel extends ShapePathContainer {

  protected _pathLine: Line = new Line("familyPath", "timeLineColor", 0);
  protected _portPath: PortPath = new PortPath("FamilyPath", "family");

  // protected _content: ShapeContainer; // = new ShapeContainer();

  constructor(
    private id: string,
    context: CanvasRenderingContext2D,
    private parentArea: Rectangle,
    private surname: string = '',
    private yDNATerminalHaplogroup = '',
    private members: PersonModel[] = []) {

    super(parentArea.CopyItem(id + "_internal"));
    this.Init(context, 100);
  }

  get Id() { return this.id; }
  get zIndex() { return 0; }
  get PathLine() { return this._pathLine; }

  DrawAll(context: any) {
    this.Draw(context);
  //  if (!this._selected) {
      this.DrawPath(context, this._portPath, this._pathLine);
  //  }
  }

  //SetPortPath(tracker: PathShapeTracker) {
  //  if (tracker.TrackedArea) {
  //    let path = this._portPath.ExtractActivePath((tracker.TrackedArea as PathShape).Ports);
  //    tracker.SetActivePath(path, this.PathLine);
  //  }
  //}

  CopyItem(newId: string): IContextItem {
    return null;
  }

  Save(): any {
    return '';
  }

  //ShiftDiscreteContent(dx: number, boundingAreaRight: number) {
  //  super.ShiftDiscreteContent(dx, boundingAreaRight);

  //}
  

  GetTouchedMember(point: Point): IShape {

    return this.RemoveItemAtPoint(point);
  }

  GetShape(point: Point): IShape {

    let c = this.Contents.filter(c => c.IsPointInShape(point));

    if (c.length > 0) {
      return c[0];
    }
    return null;
  }

  ReturnMember(member: IShape) {
    //if (member) {
    //  console.error("Returned Shape: " + member.Id);

    //}
    //else {
    //  let sss = 0;
    //  console.error("Returned Shape is null");
    //}
    this.AddContentsss(member);
  }


  public MoveBy(x: number, y: number) {
    let t = this;
    super.MoveBy(x, y);
    //let l = t._trackdContents.length - 1;
    //if (l >= 0 && t._trackdContents[l].Left > 0) {
    //  super.MoveBy(-t._trackdContents[l].Left, 0);
    //}
  }

  public UnSelect() {
    if (this.IsSelected) {
      super.UnSelect();
      this.Contents = this._trackdContents.concat([]);
      this._trackdContents = [];

    }
  }

  public Selected(point: Point): boolean {
    if (super.Selected(point)) {
      this._trackdContents = this.Contents.concat([]);
      this.Contents = [];
      return true;
    }
    return false;
  }

  Draw(context: CanvasRenderingContext2D, initial: boolean = false) {
    //this.ClearContext(context);
    //this.content.forEach(c => c.Draw(context));

    super.Draw(context);
    this.DrawPath(context, this._portPath, this._pathLine);

    //    this.FData.DrawSelectedItem(context);
  }
  get Content(): TextContent[] {
    let contents: TextContent[] = [];
    this.members.forEach(function (m, i) {// build content
      let content = new TextContent(m.Id + "_content", 'personData', 'personData_hit', m.FirstName, false, 0);
      contents.push(content);
    });
    return contents;
  }

  GetLargestWidth(ctx: CanvasRenderingContext2D, content: TextContent[]): number {
    let width = 0;
    content.forEach(function (c, i) {
      let w = c.MeasureText(ctx, 20);
      if (w > width) {
        width = w;
      }
    });
    return width;
  }

  ReturnActivePath(path: PathLink[]) {
    this._portPath.ReturnActivePath(path);
  }

  Init(ctx: CanvasRenderingContext2D, width: number) {
    let self = this;

    let contents: TextContent[] = [];
    let offsetx = 10;
    let generation = 0; //this.members.length - 1;
    let ports: IShape[] = [];
    this.members.forEach(function (m, i) {// build content
      let content = new TextContent(m.Id + "_content", 'personData', 'personData_hit', m.FirstName, false, 0);
      let w = content.MeasureText(ctx, 20);
      if (w > width) {
        width = w;
      }
      contents.push(content);
    });
    width += 10;
    let pathIdSource = '';

    contents.forEach(function (c, i) { // build content area
      let cid = c.Id + "_area_gen_" + generation.toString();
      let r = new Rectangle(cid, 20, offsetx, width, 20, 'personContainer', 0, 'personContainer_hit');
      let properties = {
        "freedomOfMotion": FreedomOfMotion.full,
        "freedomOfSizing": FreedomOfMotion.none
      }
      r.SetProperties(properties);
      let pathID = 'familyTreePath_' + self.id + "_" + generation.toString();
      let pathIdTarget = pathID + '_T';

      if (generation > 0) {
        let porttarget = new Ellipse(pathIdTarget, 29, offsetx - 2, 4, 4, 'personPort2');
        ports.push(porttarget);

        let pathLink = new PathLink(pathID + "_LINK_", pathIdSource, pathIdTarget);
        self._portPath.AddPorts(pathLink);
      }

      pathIdSource = pathID + '_S';
      let portsource = new Ellipse(pathIdSource, 29, offsetx + width - 2, 4, 4, 'personPort1');
      ports.push(portsource);

      offsetx += (width + 20);
      let personArea = new PersonArea(c, ports, r);
      self.AddContentsss(personArea);
      generation++;
      ports = [];
    });
  }


}

export class FamilyTreeDataResult implements IDataResult {


  constructor(private dateRange: Date[] = []) {}

  public get ID() { return "familytree"; }
  

  public Update(data: any) {}

  get Data(): any {
    return "";
  }

  get Flag(): any {
    return -1;
  }


}

export class FamilyTreeModel extends EventContextLayer {

  protected _data = new FamilyTreeDataResult();
  protected _mousePosition: MousePosition = new MousePosition();

  constructor(context: CanvasRenderingContext2D, parentArea: Rectangle, people: PersonModel[] = []) {

  

    super(parentArea,
      'familyTree'
      , 'familyTree'
      , 'xxx1sss'
      , new Date()
      , 'afadsf');

    let a = new Rectangle('197182_internal', -20, -20, parentArea.Width + 20, parentArea.Height + 20, 'familyTree', 0, 'familyTree');
    let familyData = new FamilyModel('197182', context, a, 'Shannon', 'R-Y34201', people);
    this.AddContent(familyData);
    this.Init();
  }

  Init() {
    super.Init();
    this.ClearContent(1);
    this.ClearPaths();
    this.AddLine("familyPath", "timeLineColor", lineTypes.straight);
  }

  LoadCanvasData(inputData: any): Promise<any> { return null; }
  UpdateCanvasData(inputData: any) { }
  AutoUpdate(): boolean { return false; }

  GetContextData(): any {
    return null;
  }

  GetDataResult(): IDataResult {
  return this._data;
  }

  SetDataResult(data: IDataResult, changeType: any) { }

  get FData(): FamilyModel {
    return this.Content[0] as FamilyModel;
  }

  GetTouchedShape(point: Point): IShape {

    return this.FData.RemoveItemAtPoint(point);
  }

  GetSelectedShape(point: Point): IShape {
    return this.FData.GetTouchedMember(point);
  }

  Draw(context: CanvasRenderingContext2D, initial: boolean = false) {
    //this.ClearContext(context);
    //this.content.forEach(c => c.Draw(context));
 
    super.Draw(context);
    this.FData.DrawAll(context);

//    this.FData.DrawSelectedItem(context);
  }
  
  ReturnTouchedShape(shape: IShape) {

    this.FData.ReturnMember(shape);

  }

  //SelectContentByPosition(mousePosition: MousePosition) {

  //  //const p = mousePosition.mousePosition;
  //  //const index = this.Content.findIndex(c => (<IShape>c).IsPointInShape(p));
  //  //this.SelectContent(index);
  //  this.FData.SelectContentFromPoint(mousePosition.mousePosition);
  //}

//  selectItem(event: any, context: CanvasRenderingContext2D): void {

//    this.ReInitMousePosition(event, this._trackingPosition);
  

//    //const i = this.Content.findIndex(c => (<IShape>c).IsPointInShape(this._mousePosition.mousePosition));
//    //this.SelectContent(i);


////    AreaSizer.Reset(this.Content[0] as IShape, false);


//    //if (this._tracker && !this._tracker.TrackedArea && this.FData.Selected(this._tracker.mousePosition.mousePosition)) {
//    //  super.selectItem(event, context);
//    //  this._mousePosition.Init(event, this.ParentArea);
//    //  return;
//    //}
//    ////  for moving individualitems.
//    //let t = this._tracker as PathShapeTracker;
//    //this.FData.SetPortPath(t);
//    //super.selectItem(event, context);

//  }

  mouseMove(event: any, context: CanvasRenderingContext2D): void {
    super.mouseMove(event, context);
   // this.FData.DrawAll(context);
  }

  //releaseSelectedItem(event: any, context: CanvasRenderingContext2D) {
  ////  console.error("releaseSelectedItem");
  ////  this.FData.UnSelect();
  ////  super.releaseSelectedItem(event, context);
  //////  let t = this._tracker as PathShapeTracker;
  ////  this.FData.ReturnActivePath(t.ActivePath);
  ////  t.ClearActivePath();
  //}
}
