import { IShape, FreedomOfMotion, AreaType } from "../IShape";
import { IContextItem } from "../../IContextItem";
import { Point } from "../primitives/point";
import { Ellipse } from "../ellipse";
import { StateIndex } from "../../DisplayValues";

class SizerHandle implements IShape {
  private _active: boolean = false;
  constructor(private id: string,
    private rangeOfMotion: number,
    private side: number,
    private shape: IShape) { }

  get Id(): string { return this.shape.Id; }
  get zIndex(): number { return this.shape.zIndex; }
  Draw(ctx: CanvasRenderingContext2D): void {
    this.shape.Draw(ctx);
  }
  CopyItem(newId: string): IContextItem { return this.shape.CopyItem(newId); }
  Save(): any { return this.shape.Save(); }
  Touch(point: Point) { }
  get Top(): number { return this.shape.Top; }
  get Right(): number { return this.shape.Right; }
  get Bottom(): number { return this.shape.Bottom; }
  get Left(): number { return this.shape.Left; }

  get Width(): number { return this.shape.Width; }
  get Height(): number { return this.shape.Height; }

  get Center(): Point { return this.shape.Center; }
  get IsHit(): boolean { return this.shape.IsHit; }

  get StateName(): string { return this.shape.StateName; }
  get AreaType(): AreaType { return this.shape.AreaType; }
  get FreedomOfMotion(): FreedomOfMotion { return this.shape.FreedomOfMotion; }
  get FreedomOfSizing(): FreedomOfMotion { return this.shape.FreedomOfSizing; }

  MoveTo(x: number, y: number) { this.shape.MoveTo(x, y); }
  SizeBy(context: any, top: number, right: number, bottom: number, left: number) { this.shape.SizeBy(context, top, right, bottom, left); }
  CenterOn(x: number, y: number) { this.shape.CenterOn(x, y); }
  SetProperties(properties: any) { this.shape.SetProperties(properties); }
  Select(criteria: any): boolean { return this.shape.Select(criteria); }
  IsPointInShape(point: Point) { return this.shape.IsPointInShape(point); }
  
  get StateIndex(): StateIndex { return this.shape.StateIndex; };
  // get Ports(): IShape[] { return this.shape.Ports; }
  public HitTest(point: Point): boolean { return false; }

  ClearHit() { this.shape.ClearHit(); };

  MoveSide(x: number, y: number, handle: number) {
    switch (this.side) {
      case 0:
        if (handle == 1 || handle == 7 || handle == 2 || handle == 6) {
          this.MoveBy(x, y);
        }
        break;
      case 1:
        if (handle == 0 || handle == 2) {
          this.MoveBy(x, y);
        }
        break;
      case 2:
        if (handle == 0 || handle == 1 || handle == 3 || handle == 4) {
          this.MoveBy(x, y);
        }
        break;
      case 3:
        if (handle == 2 || handle == 4) {
          this.MoveBy(x, y);
        }
        break;
      case 4:
        if (handle == 2 || handle == 3 || handle == 5 || handle == 6) {
          this.MoveBy(x, y);
        }
        break;
      case 5:
        if (handle == 4 || handle == 6) {
          this.MoveBy(x, y);
        }
        break;
      case 6:
        if (handle == 0 || handle == 7 || handle == 5 || handle == 4) {
          this.MoveBy(x, y);
        }
        break;
      case 7:
        if (handle == 0 || handle == 6) {
          this.MoveBy(x, y);
        }
        break;
    }
  }
  CopyShape(newID: string): IShape {

    return null;
  }
  get IsActive() { return this._active; }
  Activate(fos: FreedomOfMotion, areaType: AreaType) {
    this._active = (fos == FreedomOfMotion.vertical && (this.side == 1 || this.side == 2))
      || (fos == FreedomOfMotion.horizontal && (this.side == 3 || this.side == 7))
      || ((areaType == AreaType.constantArea || areaType == AreaType.lockedRatio) && this.side % 2 != 0)
      || fos == FreedomOfMotion.full;
  }

  DeActivate() { this._active = false; }

  //DrawHandle(context: CanvasRenderingContext2D, fos: FreedomOfMotion, areaType: AreaType) {
  //  switch (areaType) {
  //    case AreaType.constantArea:
  //    case AreaType.lockedRatio:
  //      if (this.side == 1 || this.side == 3 || this.side == 5 || this.side == 7) {
  //        this.Draw(context);
  //      }
  //      break;
  //    default: {
  //      switch (fos) {
  //        case FreedomOfMotion.vertical:
  //          if (this.side == 1 || this.side == 5) {
  //            this.Draw(context);
  //          }
  //          break;
  //        case FreedomOfMotion.horizontal:
  //          if (this.side == 3 || this.side == 7) {
  //            this.Draw(context);
  //          }
  //          break;
  //        default: this.Draw(context); break;
  //      }
  //    }
  //  }
  // }


  MoveBy(x: number, y: number) {
    switch (this.rangeOfMotion) {
      case 0: this.shape.MoveBy(x, y); break;
      case 1: this.shape.MoveBy(0, y); break;
      case 2: this.shape.MoveBy(x, 0); break;
    };
  }

  get Side(): number { return this.side; }
}

class SizerHandleRectangle extends SizerHandle {
}

class SizerHandleEllipse extends SizerHandle {
}



export abstract class AreaSizer {

  private static _areaId: string = "";
  private static _handles: SizerHandle[] = [];
  private static _activeHandles: SizerHandle[] = [];
  private static _sideSelected: boolean = false;

  constructor() {}

  static Init(handleShape: IShape ) {
    

    this._handles.push(new SizerHandle('sizerTopLeft', 0, 0, handleShape.CopyShape(handleShape.Id + '_handle_text_TopLeft')));
    this._handles.push(new SizerHandle('sizerTop', 1, 1, handleShape.CopyShape(handleShape.Id + '_handle_text_Top')));
    this._handles.push(new SizerHandle('sizerTopRight', 0, 2, handleShape.CopyShape(handleShape.Id + '_handle_text_TopRight')));
    this._handles.push(new SizerHandle('sizerRight', 2, 3, handleShape.CopyShape(handleShape.Id + '_handle_text_right')));
    this._handles.push(new SizerHandle('sizerBottomRight', 0, 4, handleShape.CopyShape(handleShape.Id + '_handle_text_BottomRight')));
    this._handles.push(new SizerHandle('sizerBottom', 1, 5, handleShape.CopyShape(handleShape.Id + '_handle_text_Bottom')));
    this._handles.push(new SizerHandle('sizerBottomLeft', 0, 6, handleShape.CopyShape(handleShape.Id + '_handle_text_BottomLeft')));
    this._handles.push(new SizerHandle('sizerLeft', 2, 7, handleShape.CopyShape(handleShape.Id + '_handle_text_left')));

  }


  static Activate(trackedArea: IShape) {
    const t = this;
    this._handles.forEach(h => h.Activate(
      trackedArea.FreedomOfSizing,
      trackedArea.AreaType));
  }

  static Deactivate() {
    this._handles.forEach(h => h.DeActivate());
    this.ReleaseHandle();
  }

  static ReleaseHandle() {
    this._activeHandles = [];
    this._sideSelected = false;
  }


  static select(point: Point): boolean {
    this._activeHandles = [];
    let handle = this._handles.filter(h => h.IsActive).find(h => h.IsPointInShape(point));
    if (handle) {

      let x = handle.Center.X;
      let y = handle.Center.Y;

      switch (handle.Side) {
        case 0: this._activeHandles = this._handles.filter(s => s.Center.Y == y && s.Center.X == x); break;
        case 1: this._activeHandles = this._handles.filter(s => s.Center.Y == y); break;
        case 2: this._activeHandles = this._handles.filter(s => s.Center.Y == y && s.Center.X == x); break;
        case 3: this._activeHandles = this._handles.filter(s => s.Center.X == x); break;
        case 4: this._activeHandles = this._handles.filter(s => s.Center.Y == y && s.Center.X == x); break;
        case 5: this._activeHandles = this._handles.filter(s => s.Center.Y == y); break;
        case 6: this._activeHandles = this._handles.filter(s => s.Center.Y == y && s.Center.X == x); break;
        case 7: this._activeHandles = this._handles.filter(s => s.Center.X == x); break;
      }
    }
    this._sideSelected = this._activeHandles.length > 0;
    return this._sideSelected;
  }

  static InArea(point: Point): boolean {
    const r = (point.Y < this._handles[0].Top
      || point.X < this._handles[0].Left
      || point.Y > this._handles[4].Bottom
      || point.X > this._handles[4].Right )
    if (r) {
      console.error("BANG!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    }
 
    console.error(point.X + ":" + this._handles[0].Left);
      return !r;

  }

  static ResizeShape(trackedArea: IShape) {
    trackedArea.SizeBy(
      null,
      this._handles[1].Center.Y,
      this._handles[3].Center.X,
      this._handles[5].Center.Y,
      this._handles[7].Center.X);
  }

  static Hide() {
    this.Reset(null);
  }

  static Reset(area: IShape, deactivate: boolean = true ) {

    if (deactivate) {
      this.Deactivate();
    }
    let xhalf = area.Left + (area.Width / 2);
    let yhalf = area.Top + (area.Height / 2);
    this._handles[0].CenterOn(area.Left, area.Top);
    this._handles[1].CenterOn(xhalf, area.Top);
    this._handles[2].CenterOn(area.Right, area.Top);
    this._handles[3].CenterOn(area.Right, yhalf);
    this._handles[4].CenterOn(area.Right, area.Bottom);
    this._handles[5].CenterOn(xhalf, area.Bottom);
    this._handles[6].CenterOn(area.Left, area.Bottom);
    this._handles[7].CenterOn(area.Left, yhalf);
    this.Activate(area);
    this._areaId = area.Id;
  }

  static Draw(context: CanvasRenderingContext2D, initial: boolean = false) {
    let activeHandles = this._handles.filter(h => h.IsActive);
    activeHandles.forEach(h => h.Draw(context));
  }

  static MoveItem(dx: number, dy: number, areaId: string = '') {
    // let activeHandles = this._handles.filter(h => h.IsActive);
    if (this._areaId == areaId) {
      this._handles.forEach(h => h.MoveBy(dx, dy));
    }
  }

  static MoveSide(dx: number, dy: number, area: IShape): boolean {
    if (this._sideSelected) {
      this._activeHandles.forEach(h => h.MoveBy(dx, dy));
      this.ResizeShape(area);
    }
    return this._sideSelected;
  }
}

export class SizeableArea {


  constructor(private _shape: IShape = null) {
   // AreaSizer.Init();
    AreaSizer.Reset(this._shape);
  }

  Init(shape: IShape) {
    this._shape = shape;
 //   AreaSizer.Init();
    AreaSizer.Reset(this._shape);
  }

  MoveBy(x: number, y: number) {
    if (!AreaSizer.MoveSide(x, y, this._shape)) {
      this._shape.MoveBy(x, y);
      AreaSizer.MoveItem(x, y);
    }
  }

  Draw(context: CanvasRenderingContext2D) {
    if (this._shape) {
      console.error("SIZER Shape ID:" + this._shape.Id);
      this._shape.Draw(context);
      AreaSizer.Draw(context);
    }
  }

  IsPointInShape(point: Point) {
    if (AreaSizer.select(point)) {
      return true;
    }
   
    return false;
  }
}
