import { ContextLayer, IContextItem, EventContextLayer, IDataResult } from "src/canvas/models/IContextItem";
import { Rectangle } from "src/canvas/models/shapes/rectangle";
import { DisplayValues } from "src/canvas/models/DisplayValues";
import { Ellipse } from "src/canvas/models/shapes/ellipse";
import { Port } from "src/canvas/models/shapes/port";
import { lineTypes } from "src/canvas/models/lines/line";
import { generate } from "rxjs";
import { IShape } from "src/canvas/models/shapes/IShape";
import { Point } from "src/canvas/models/shapes/primitives/point";

export class STRModel {
  constructor(
    private Name: string,
    private Value: number,
    private mutationRate: number ) {
  }
}

export class STRListModel {
  constructor(
    private STRs: STRModel [] = []) {
  }
}

export interface ILeaf {
  Id: string;
  DisplayName: string;
  Identify(value: any): boolean;
}

export interface IBranch {
  FindBranch(id: any): Branch;
  FindBranchByPath(path: any[]): Branch;
  AddBranch(branch: Branch);
  AddLeaf(leaf: ILeaf);
}

export class Branch implements IBranch, ILeaf{
  _activeBranch: Branch = null;
  constructor(
    private id: string,
    private displayName: string,
    protected branches: Branch[] = [],
    private leafs: ILeaf[] = []) {
  }

  get Id(): string { return this.id; }
  get DisplayName(): string { return this.displayName; }
   
  Identify(value: any): boolean { return this.id === value; }
  6
  public FindBranch(id: any): Branch {

    return this.Identify(id) ? this : this.branches.find(b => b.FindBranch(id) != null);

  }

  public FindBranchByPath(path: any[]): Branch{
    let id = path.shift();
    let branch = this.FindBranch(id);
    if (branch && path.length > 0) {
      return branch.FindBranchByPath(path);
    }
    return branch;
  }

  public AddBranch(branch: Branch) {
    this.branches.push(branch);
  }

  public AddLeaf(leaf: ILeaf) {
    this.leafs.push(leaf);
  }


}

export class Tree implements IBranch {
  _activeBranch: Branch = null;
  _activepath: any[];

  constructor() {
    this._activeBranch = new Branch("0", "root");
  }

  public SetBranchByPath(path: any[]){
    this._activeBranch = this._activeBranch.FindBranchByPath(path);
  }

  FindBranch(id: any): Branch {
    this._activeBranch = this._activeBranch.FindBranch(id);
    return null;
  }

  public FindBranchByPath(path: any[]): Branch {
    this._activeBranch = this._activeBranch.FindBranchByPath(path)
    return null;
  }

  public AddBranch(branch: Branch) {
    this._activeBranch.AddBranch(branch);
  }

  public AddLeaf(leaf: ILeaf) {
    this._activeBranch.AddLeaf(leaf);
  }

}

export class YDNAModel implements IContextItem {

  constructor(
    private yDNATerminalHaplogroup: string,
    private TMRCA_Range: number[] = [],
    private STRs: STRListModel = new STRListModel()) {
   
  }

  get HG() { return this.yDNATerminalHaplogroup; }
  get Id() { return this.yDNATerminalHaplogroup; }
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

    let self = this;
    let r = new Rectangle(contentName, 0, 10, sz, 20, 'Haplogroup')
    parent.AddContent(r);
    parent.AddText(r, this.yDNATerminalHaplogroup, 'Haplogroup', 'DefaultFG', false);
    let offsetx = 10;
   
    let ports: Port[] = [];

    // DisplayValues.Clear();

    //  this.GetContentItem
    //PortPath.
 
    let pathId = 'HaplogroupPath_' + self.yDNATerminalHaplogroup;

    let cid = self.yDNATerminalHaplogroup + "_ydnaarea_";
    //  m.AddContent(contentName + "_" + i.toString(), parent, parentArea, r.Width, offsetx, cid);

      let port1 = new Ellipse(pathId, 29, offsetx + r.Width - 2, 4, 4, 'personPort1');

    ports.push(new Port("HaplogroupPath", 0, 0, cid, 'hgPath', 'personPort1', port1, 0));

  }
}

//export class YDNALineageModel implements IContextItem {

//  constructor(
//    private yDNATerminalHaplogroup: string,
//    private TMRCA: number) {
//  }

//  get Id() { return ""; }
//  get zIndex() { return 0; }

//  Draw(contextModel) {

//  }

//  CopyItem(newId: string): IContextItem {
//    return null;
//  }

//  Save(): any {
//    return '';
//  }

//  AddContent(contentName: string, parent: ContextLayer, parentArea: Rectangle, sz: number, offset: number) {
//  }
//}


export class YDNATreeLayer extends EventContextLayer {
  snps: YDNAModel[] = [];
  constructor(parentArea: Rectangle) {

    super(parentArea,
      'YDNATree'
      , 'familyTree'
      , 'xxx1sss'
      , new Date()
      , 'afadsf');

    this.snps.push(new YDNAModel("R-Y34201"));
    this.snps.push(new YDNAModel("R-Y34202 "));
    this.snps.push(new YDNAModel("R-E306"));
    this.snps.push(new YDNAModel("R-Y23202"));
    this.snps.push(new YDNAModel("R-FR123394"));
    this.snps.push(new YDNAModel("R-1211"));
 
    //   this.Set();
    //   (<Rectangle>this.Content[0].).AddPort().
 //   this.AddContent(new Rectangle('familyTree', 0, 0, this.ParentArea.Width, this.ParentArea.Height, 'familyTree'));
    this.Init();
  }
  
  Init() {
    let self = this;
    this.ClearContent(1);
    this.ClearPaths();
    this.AddLine("hgPath", "timeLineColor", lineTypes.bezier);
    this.AddContent(new Rectangle('hgPath', 0, 0, this.ParentArea.Width, this.ParentArea.Height / 2, 'hgPath'));
    let offset = 20;
    let p = this.Content[0] as Rectangle;
    this.snps.forEach(function (s, i) {
      let r = new Rectangle('hgdata', 0, 10, 80, offset, 'Haplogroup');
      self.AddContent(r);
      self.AddText(r, s.Id, 'Haplogroup', 'DefaultFG', false);
      let offsetx = 10;

      let ports: Port[] = [];

      // DisplayValues.Clear();

      //  this.GetContentItem
      //PortPath.

      let pathId = 'HaplogroupPath_' + s.Id;

      let cid = s.Id + "_ydnaarea_";
      //  m.AddContent(contentName + "_" + i.toString(), parent, parentArea, r.Width, offsetx, cid);

      let port1 = new Ellipse(pathId, 29, offsetx + r.Width - 2, 4, 4, 'personPort1');

      ports.push(new Port("HaplogroupPath", 0, 0, cid, 'hgPath', 'personPort1', port1, 0));
    });
  //  this.familyData.AddContent('familydata', this, this.Content[0] as Rectangle, 190, 0);
  }
  LoadCanvasData(inputData: any): Promise<any> { return null; }
  UpdateCanvasData(inputData: any) { }
  AutoUpdate(): boolean { return false; }
  GetContextData(): any {
    return null;
  }
  GetSelectedShape(point: Point): IShape { return null };

  GetTouchedShape(point: Point): IShape { return null }
  ReturnTouchedShape(shape: IShape) { }
  
  GetDataResult(): IDataResult {
    return null;
  }

  GetDateResult(): IDataResult {
    return null;
  }

  SetDataResult(data: IDataResult, changeType: any) { }

}
