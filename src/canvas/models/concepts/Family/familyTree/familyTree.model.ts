import { ContextLayer, IContextItem, IContextSystem, EventContextLayer, PathShapeTracker, ITracker, MousePosition } from "src/canvas/models/IContextItem";
import { Rectangle } from "src/canvas/models/shapes/rectangle";
import { DisplayValues, StateIndex } from "src/canvas/models/DisplayValues";
import { Ellipse } from "src/canvas/models/shapes/ellipse";
import { Port } from "src/canvas/models/shapes/port";
import { lineTypes, PathLink, PortPath, Line } from "src/canvas/models/lines/line";
import { generate } from "rxjs";
import { TextContent, Content } from "src/canvas/models/shapes/content/Content";
import { ShapeContainer, PathShape, Shape } from "src/canvas/models/shapes/shape";
import { IShape, IShapeContainer } from "src/canvas/models/shapes/IShape";
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
export class PersonModel  {

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

export class FamilyModel extends ShapeContainer {

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
  get PathLine() { return this._pathLine;}
 // get PathL
  //MoveContent(dx: number, parentArea: Shape, context: CanvasRenderingContext2D): void {
  //  this._content.ShiftDiscreteContent(dx, parentArea.Right);
  //  this._content.DrawContent(context);
  //}

  //Draw(context: any) {
  //  this._content.DrawContent(context);
  //}

  DrawAll(context: any) {
    this.Draw(context);
    if (!this._selected) {
      this.DrawPath(context, this._portPath, this._pathLine);
    }
  }

  SetPortPath(tracker: PathShapeTracker) {
    if (tracker.TrackedArea) {
      let path = this._portPath.ExtractActivePath((tracker.TrackedArea as PathShape).Ports);
      tracker.SetActivePath(path, this.PathLine);
    }
  }

  GetShape(point: Point): IShape {

    let c = this.Contents.filter(c => c.IsPointInShape(point));

    if (c.length > 0) {
      return c[0];
    }
    return null;
  }
  
  //DrawPortPath(context: CanvasRenderingContext2D, portPath: PortPath, pathLine: Line) {
  //  this._content.DrawPath(context, portPath, pathLine);
  //}

  CopyItem(newId: string): IContextItem {
    return null;
  }

  Save(): any {
    return '';
  }

  RemoveContent(point: Point) {
//    let c = this._content;
    
  }

  ShiftDiscreteContent(dx: number, boundingAreaRight: number) {
    super.ShiftDiscreteContent(dx, boundingAreaRight);

  }

  GetMouseUpTracker() {
    return new PathShapeTracker(this._pathLine);
  }

  GetTouchedMember(point: Point): IShape {
   
    let m = this.RemoveItemAtPoint(point);

   // remove selected items on button down
   // redraw base
   // add removed items to active state (top)
   // redraw top 

    // if m is null but in internalshape
    // all contents must be lifted into the tracker
      //if (!m) {
      //  m = this._content;
      //  this._content = null;
      //}
      return m;
    //if (m) {
    //  console.error((<PersonArea>m).InternalShape.GetName());
    //}
    //else {
    //  console.error("No content returned");
    //}
   // return null;
  }

  ReturnMember(member: IShape) {
    if (member) {
      console.error("Returned Shape: " + member.Id);

    }
    else {
      let sss = 0;
      console.error("Returned Shape is null");
    }
      this.AddContent(member);
  }


  public MoveBy(x: number, y: number) {
    let t = this;
    super.MoveBy(x, y);
    let l = t._trackdContents.length -1;
    if (l >= 0 && t._trackdContents[l].Left > 0) {
      super.MoveBy(-t._trackdContents[l].Left,0);
    }
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

  ReturnActivePath(path: PathLink[]) {
    this._portPath.ReturnActivePath(path);
  }

  Init(ctx: CanvasRenderingContext2D, width: number) {
    let self = this;
   // this._content = new ShapeContainer(parentArea.CopyShape("123_" + parentArea.Id));

    let contents: TextContent[] = [];
 //   let r = new Rectangle(contentName, 0, 10, sz, 20, 'FamilyName');
 //   parent.AddContent(content);
 //   parent.AddText(r, this.surname + " " + this.yDNATerminalHaplogroup, 'FamilyName', 'DefaultFG', false);
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
        self._portPath.AddPorts(pathLink);
      }

      pathIdSource = pathID + '_S';
      let portsource = new Ellipse(pathIdSource, 29, offsetx + width - 2, 4, 4, 'personPort1');
      ports.push(portsource);

      offsetx += (width + 20);
      let personArea = new PersonArea(c,ports, r);
      self.AddContent(personArea);



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


  protected _mousePosition: MousePosition = new MousePosition();

 // protected _pathLine: Line = new Line("familyPath", "timeLineColor", 0);
 // protected _portPath: PortPath = new PortPath("FamilyPath", "family");
 // familyData: FamilyModel;

  constructor(context: CanvasRenderingContext2D, parentArea: Rectangle, private people: PersonModel[] = []) {

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

    // parentArea.CopyItem('197182'_internal");
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
  //  this.AddContent(new Rectangle('familyTree', 0, 0, this.ParentArea.Width, this.ParentArea.Height / 2, 'familyTree'));

  //  this.familyData.AddContent(context, 'familydata', this, this._portPath, this.Content[0] as Rectangle, 100, 0);
  }
  LoadCanvasData(inputData: any): Promise<any>  { return null; }
  UpdateCanvasData(inputData: any) {}
  AutoUpdate(): boolean { return false; }

  GetContextData(): any {
    return null;
  }

  get FData(): FamilyModel {
    return this.Content[0] as FamilyModel;
  }

  GetSelectedShape(point: Point): IShape {
    return this.FData.GetTouchedMember(point);
  }

  Draw(context: CanvasRenderingContext2D, initial: boolean = false) {
    this.ClearContext(context);
    this.content.forEach(c => c.Draw(context));
    this.FData.DrawAll(context);
    //this.content.forEach(s =>
    //  (<Shape>s).Ports.forEach(p => this.DrawPortPath(context, p as Port)));
    //this.DrawPortPath(context);

    //if (initial) {
    //  this._tracker.Draw(context, true);
    //}
  }

  GetMouseUpTracker() {
    return this.FData.GetMouseUpTracker();
  }

  GetTouchedShape(point: Point): IShape {

    let s = this.FData.GetShape(point);
    //if (s == null) {
    //  if (this.FData.InternalShape.IsPointInShape(point)) {
    //    let x = this.Content.splice(0);
    //    s = x[0] as IShape;
    //  }
    //}
    return s;
  }

  ReturnTouchedShape(shape: IShape) {
    //if( shape){

    //  console.error("ReturnTouchedShape:" + shape.Id);
    //}
    //else{
    //  console.error("ReturnTouchedShape:null" );
    //}
    //if (this.content.length <= 0 && shape) {
    //  this.AddContent(shape);
    //}
    //else {
      this.FData.ReturnMember(shape);
    //}
  }

  selectItem(event: any, context: CanvasRenderingContext2D): void {
    if (this._tracker && !this._tracker.TrackedArea && this.FData.Selected(this._tracker.mousePosition.mousePosition))
    {
      super.selectItem(event, context);
      this._mousePosition.Init(event, this.ParentArea);
      return;
    }
    //  for moving individualitems.
    let t = this._tracker as PathShapeTracker;
    this.FData.SetPortPath(t);
    super.selectItem(event, context);

    // 1) lift everything from the main layer.

    // test to grab main
      ////let s = this.content[1] as IShape;
    ////if (s.IsPointInShape(t.mousePosition)) {
    ////  let xxx = 0;
    ////}
  }

  mouseMove(event: any, context: CanvasRenderingContext2D): void {
    if (this.FData.IsSelected) {

      this._mousePosition.Update(event, this.ParentArea);
      this.FData.MoveBy(this._mousePosition.Delta.X, 0);
      this.FData.Draw(context);
      context.clearRect(this.ParentArea.Left, this.ParentArea.Top, this.ParentArea.Width, this.ParentArea.Height);
    }
    else {
      super.mouseMove(event, context);
    }
  }

  releaseSelectedItem(event: any, context: CanvasRenderingContext2D) {
    this.FData.UnSelect();
    super.releaseSelectedItem(event, context);
    let t = this._tracker as PathShapeTracker;
    this.FData.ReturnActivePath(t.ActivePath);
    t.ClearActivePath();
  }
}
