import { ContextLayer, IContextItem, IContextSystem, EventContextLayer, PathShapeTracker } from "src/canvas/models/IContextItem";
import { Rectangle } from "src/canvas/models/shapes/rectangle";
import { DisplayValues, StateIndex } from "src/canvas/models/DisplayValues";
import { Ellipse } from "src/canvas/models/shapes/ellipse";
import { Port } from "src/canvas/models/shapes/port";
import { lineTypes, PathLink, PortPath, Line } from "src/canvas/models/lines/line";
import { generate } from "rxjs";
import { TextContent, Content } from "src/canvas/models/shapes/content/Content";
import { ShapeContainer, PathShape } from "src/canvas/models/shapes/shape";
import { IShape } from "src/canvas/models/shapes/IShape";
import { Point } from "src/canvas/models/shapes/primitives/point";
import { PathService } from "src/canvas/models/shapes/service/path.service";

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

export class PersonArea extends PathShape {

  constructor(
    private content: TextContent,
    protected ports: IShape[] = [],
    protected internalShape: IShape) {
    super(ports,internalShape);
 //   this._name = new TextContent(id + "_content", contentState, name, false, 0);
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

  DrawAll(context: any, portPath: PortPath, line: Line) {
    this.Draw(context);
    this._content.DrawPath(context, portPath, line);
  }

  DrawPortPath(context: CanvasRenderingContext2D, portPath: PortPath, pathLine: Line) {
    this._content.DrawPath(context, portPath, pathLine);

  }

  CopyItem(newId: string): IContextItem {
    
    return null;
  }

  Save(): any {
    return '';
  }

  GetTouchedMember(point: Point): IShape {
    let m = this._content.RemoveItemAtPoint(point);
    //if (m) {
    //  console.error((<PersonArea>m).InternalShape.GetName());
    //}
    //else {
    //  console.error("No content returned");
    //}
    return m;
  }

  ReturnMember(member: IShape) {
    //if (member) {
    //  console.error("RETURN: " + (<PersonArea>member).GetName());

    //}
    this._content.AddContent(member);
  }

  get Content(): TextContent []{
    let contents: TextContent[] = [];
    this.members.forEach(function (m, i) {// build content
      let content = new TextContent(m.Id + "_content", 'personData', 'personData_hit', m.FirstName, false, 0);
      contents.push(content);
    });
    return contents;
  }

  GetLargestWidth(ctx: CanvasRenderingContext2D, content : TextContent []): number {
    let width = 0;
    content.forEach(function (c, i) {
      let w = c.MeasureText(ctx, 20);
      if (w > width) {
        width = w;
      }
    });
    return width;
  }

  AddContent(ctx: CanvasRenderingContext2D, contentName: string, parent: ContextLayer,path: PortPath, parentArea: Rectangle, sz: number, offset: number) {
    let width = sz;
    let self = this;

    let contents: TextContent[] = [];
    let r = new Rectangle(contentName, 0, 10, sz, 20, 'FamilyName');
    parent.AddContent(r);
    parent.AddText(r, this.surname + " " + this.yDNATerminalHaplogroup, 'FamilyName', 'DefaultFG', false);
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
      let pathID = 'familyTreePath_' + self.id + "_" + generation.toString();
      let pathIdTarget = pathID + '_T';

      if (generation > 0) {
        let porttarget = new Ellipse(pathIdTarget , 29, offsetx - 2, 4, 4, 'personPort2');
        ports.push(porttarget);

        let pathLink = new PathLink(pathID + "_LINK_", pathIdSource, pathIdTarget);
        path.AddPorts(pathLink);
      }

      pathIdSource = pathID + '_S';
      let portsource = new Ellipse(pathIdSource, 29, offsetx + width - 2, 4, 4, 'personPort1');
      ports.push(portsource);

      offsetx += (width + 20);
      let personArea = new PersonArea(c,ports, r);
      self._content.AddContent(personArea);



      generation++;
      ports = [];
    });
  }


}


//export class FamilyPath extends PathLink {
//  constructor(private family: FamilyModel){
//    super();
//  }

//  //private GetMember() {
//  //  this.family.forEach(function (m, i) {// build content
//  //    let content = new TextContent(m.Id + "_content", 'personData', 'personData_hit', m.FirstName, false, 0);
//  //    let w = content.MeasureText(ctx, 20);
//  //    if (w > width) {
//  //      width = w;
//  //    }
//  //    contents.push(content);
//  //  });
//  //}

//}


export class FamilyTreeModel extends EventContextLayer {

  protected _pathLine: Line = new Line("familyPath", "timeLineColor", 0);
  protected _portPath: PortPath = new PortPath("FamilyPath", "family");

  constructor(parentArea: Rectangle, private familyData: FamilyModel, context : CanvasRenderingContext2D) {

    super(parentArea,
      'familyTree'
      , 'familyTree'
      , 'xxx1sss'
      , new Date()
      , 'afadsf');
   // this._pathLine = new Line("familyPath", "timeLineColor", 0);

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

    this.familyData.AddContent(context, 'familydata', this, this._portPath, this.Content[0] as Rectangle, 100, 0);
  }
  LoadCanvasData(inputData: any): Promise<any>  { return null; }
  UpdateCanvasData(inputData: any) {}
  AutoUpdate(): boolean { return false; }

  GetContextData(): any {
    return null;
  }

  Draw(context: CanvasRenderingContext2D, initial: boolean = false) {
    this.ClearContext(context);
    this.familyData.DrawAll(context, this._portPath, this._pathLine);
    //this.content.forEach(s =>
    //  (<Shape>s).Ports.forEach(p => this.DrawPortPath(context, p as Port)));
   // this.DrawPortPath(context);

    if (initial) {
      this._tracker.Draw(context, true);
    }
  }

  GetMouseUpTracker() {
    return new PathShapeTracker(this._pathLine);
  }

  GetTouchedShape(point: Point): IShape {

    return this.familyData.GetTouchedMember(point);

  }

  ReturnTouchedShape(shape: IShape) {
    this.familyData.ReturnMember(shape);
  }

  selectItem(event: any, context: CanvasRenderingContext2D): void {
    let t = this._tracker as PathShapeTracker;

    let path = this._portPath.ExtractActivePath((t.TrackedArea as PathShape).Ports);
    t.SetActivePath(path, this._pathLine);

    super.selectItem(event, context);
    
  }

  mouseMove(event: any, context: CanvasRenderingContext2D): void {
    super.mouseMove(event, context);
  }

  releaseSelectedItem(event: any, context: CanvasRenderingContext2D) {
    super.releaseSelectedItem(event, context);
    let t = this._tracker as PathShapeTracker;
    this._portPath.ReturnActivePath(t.ActivePath);
    t.ClearActivePath();
  }
}
