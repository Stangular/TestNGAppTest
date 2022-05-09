import { extend } from "webdriver-js-extender";
import { Rectangle } from "src/canvas/models/shapes/rectangle";
import { AreaTracker, AreaSizer } from "src/canvas/models/IContextItem";
import { Point } from "src/canvas/models/shapes/primitives/point";
import { DisplayValues, StateIndex } from "src/canvas/models/DisplayValues";
import { TextContent, IDynamicContent } from "src/canvas/models/shapes/content/Content";
import { TextShape } from "src/canvas/models/shapes/content/text/text";
import { ActionItemsss, IActionItem, IMouseState } from "src/canvas/component/layers/Interfaces/IActionLayer";
import { forEach } from "@angular/router/src/utils/collection";
import { IShape, FreedomOfMotion } from "src/canvas/models/shapes/IShape";
import { ContentShape } from "src/canvas/models/shapes/content/ContentShape";
import { Shape } from "src/canvas/models/shapes/shape";

export class YearContent extends TextContent {


  constructor(Id: string,
    stateName: string,
    private year: number,
    fromSource: boolean = false,
    angle: number = 0) {
    super(Id,
      stateName,
      year.toString(),
      fromSource,
      angle);

  }

  Update(content: number) {
    this.year += content;
    this.content = this.year.toString();
  }
}

export class MonthContent extends TextContent {


  constructor(Id: string,
    stateName: string,
    private month: number,
    fromSource: boolean = false,
    angle: number = 0) {
    super(Id,
      stateName,
      month.toString(),
      fromSource,
      angle);
    this.Update(month);
  }

  Update(content: number) {
    //this.month += content;
    // this.month = content;
    let m = 'J';
    switch (this.month) {
      case 1: m = 'F'; break;
      case 2: m = 'M'; break;
      case 3: m = 'A'; break;
      case 4: m = 'M'; break;
      case 5: m = 'J'; break;
      case 6: m = 'J'; break;
      case 7: m = 'A'; break;
      case 8: m = 'S'; break;
      case 9: m = 'O'; break;
      case 10: m = 'N'; break;
      case 11: m = 'D'; break;

    }
    this.content = m;
  }
}
export class DecadeContent extends TextContent {


  constructor(Id: string,
    stateName: string,
    private year: number,
    fromSource: boolean = false,
    angle: number = 0) {
    super(Id,
      stateName,
      year.toString(),
      fromSource,
      angle);

  }

  Update(content: number) {
    this.year += (content * 10);
    this.year = Math.floor(this.year / 10) * 10;
    this.content = this.year.toString();
  }
}

export class CenturyContent extends TextContent {

  constructor(Id: string,
    stateName: string,
    private year: number,
    fromSource: boolean = false,
    angle: number = 0) {
    super(Id,
      stateName,
      year.toString(),
      fromSource,
      angle);

  }

  Update(content: number) {
    this.year += (content * 100);
    this.year = Math.floor(this.year / 100) * 100;
    this.content = this.year.toString();
  }
}

export interface ITimeLine extends IActionItem {
  Update();
}

export class TimeLineModel {
  private _theTimeLine: ITimeLine;
  private _unitRange: number = 0;

}

export class TimeLineSlider extends Rectangle {
  //  private _sizer: Sizer;

  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number) {
    super("timelineSpan_" + id,
      top,
      left,
      width,
      height,
      'TimeSpansss',
    1);
    this._freedomOfSizing = FreedomOfMotion.horizontal;
    this._freedomOfMotion = FreedomOfMotion.horizontal;
  }

  MoveBy(x: number, y: number) {
      super.MoveBy(x, y);
    //  Tools.Sizer.Reset(this);
  }

  Draw(context: CanvasRenderingContext2D) {
    super.Draw(context);
  //  Tools.Sizer.Draw(context);
  }

  //SelectContentFromPoint(point: Point): boolean {
  //  if (super.SelectContentFromPoint(point)) {
      
  //    return true;
  //  }
  //  return false;
  //}

}

export abstract class TimeLine extends Rectangle implements ITimeLine {

  // protected 
  protected _actionItem: ActionItemsss;
  protected _temporalOffset: number = 0;
 // protected _slider: TimeLineSlider = null;

  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    stateName: string = '',
    protected _unitSize: number) {
    super(id,
      top,
      left,
      width,
      height,
      stateName);
    this._actionItem = new ActionItemsss();
   // this._slider = new TimeLineSlider(id, top, 100, 80, 30);

    this._freedomOfSizing = FreedomOfMotion.none;
    this._freedomOfMotion = FreedomOfMotion.horizontal;

  }

  abstract Update();
  abstract Init();
  abstract TimeUnit(Id: string,
    stateName: string,
    value: number,
    fromSource: boolean,
    angle: number): TextContent;


  //Track(point: Point, tracker: AreaTracker): boolean {
  //  return super.Track(point, tracker); //this.SelectContentFromPoint(point) && tracker.Reset(this);
  //}

  get mouseState(): IMouseState {
    return this._actionItem.mouseState;
  }

  get mousePosition(): Point {
    return this._actionItem.mousePosition;
  }

  mouseCapture(event: any, boundingArea: Rectangle): Point {
    return this._actionItem.mouseCapture(event, boundingArea);
  }

  mouseRelease(): void {
    this._actionItem.mouseRelease();
  }

  mouseMove(event: any, boundingArea: Rectangle): Point {
    let d = this._actionItem.mouseMove(event, boundingArea);
    this._temporalOffset += d.X;
    return d;
  }

  public DrawContent(context: any) {
    super.DrawContent(context);
    //if (!this._slider.IsTracked) {
    //  this._slider.Draw(context);
    //}
  }

  Resize(sizer: AreaSizer) {
    if (this.IsHit) {
      //sizer.ResizeShape(null, this._slider);
    }
  }

 // public DrawHitContent(context: any): boolean {
 //   if (this.IsHit ){
 //     this.Draw(context);
 //     this.DrawContent(context);
 //   }
 //   //if (this._slider.Id == Tools.Sizer.AreaId) {
 //   //  this._slider.Draw(context);
 //   //}
 //   //else {
 //     this._slider.DrawHitContent(context);
 ////   }
 //   return this.IsHit;
 // }

 // public DrawNotHitContent(context: any): boolean {
 //   if (!this.IsHit) {
 //     super.DrawNotHitContent(context);
 //     this._slider.DrawNotHitContent(context);
 //     return true;
 //   }
 //   return false;
 // }

  ClearHit() {
//Tools.Sizer.Release();
 //   this._slider.ClearHit();
    super.ClearHit();
  }

  SelectContentFromPoint(point: Point): boolean {
    return super.SelectContentFromPoint(point);
  }

  MoveIfHit(point: Point): boolean{
    //if (Tools.Sizer.MoveSide(point.X, point.Y)) {
    //  Tools.Sizer.ResizeShape(null, this._slider);
    //  return true;
    //}
    return super.MoveIfHit(point);
  }
}

export abstract class TimeLineByYear extends TimeLine {

  protected _referenceYear: number = -1;

  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    stateName: string = '',
    unitSize: number) {

    super(id,
      top,
      left,
      width,
      height,
      stateName,
      unitSize);

    this.Init();
  }

  get offsetRange() {
    let range = this._temporalOffset / this._unitSize;
    return this._referenceYear - Math.round(range);
  }

  Update() {
    this.Contents.forEach(c => (<YearContent>c.Content).Update(this.offsetRange));
  }

  SetTimeLine(parent: Rectangle) {
    parent.SetShapes(this.Contents);
  }

  get ReferenceYear() {
    if (this._referenceYear == -1) {
      let d = new Date();
      this._referenceYear = d.getFullYear();
    }
    return this._referenceYear;
  }

  set ReferenceYear(year: number) {
    this._referenceYear = year;
  }

  InitToRange(range: number = 1) {

    let position = Math.round(DisplayValues.Width);
    let refYear = this.ReferenceYear;

    refYear = Math.round(refYear / range) * range;
    let count = 0;
    for (; position > this.Left - this.Width; position -= this._unitSize) {
      let state = (count % 2 == 0) ? 'EvenSlot' : 'OddSlot';
      let c = this.TimeUnit("timelineSlot_text_" + refYear, state, refYear, false, 0);
      let s = new TextShape(
        "timelineSlot_" + count,
        this.Top,
        position - this._unitSize,
        this._unitSize, 30, state, c);
      this.AddContent(s);
      refYear -= range;
      count++;
    }
    if (count % 2 != 0) { this.Contents.pop(); }// Ensure the range length is always an odd number (otherwise the color coding will be wrong)...
  }
}

export class TimeLineByYearModelH extends TimeLineByYear {

  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    stateName: string = '',
    unitSize: number) {

    super(id,
      top,
      left,
      width,
      height,
      stateName,
      unitSize);

  }

  Init() {
    super.InitToRange();
  }

  TimeUnit(Id: string,
    stateName: string,
    year: number,
    fromSource: boolean = false,
    angle: number = 0): TextContent {
    return new YearContent(Id, stateName, year, fromSource, angle);
  }
}

export class TimeByDecadeModelH extends TimeLineByYear {
  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    stateName: string = '',
    unitSize: number,
    referenceYear: number = -1) {

    super(id,
      top,
      left,
      width,
      height,
      stateName,
      unitSize);
  }

  Init() {
    super.InitToRange(10);
  }
  TimeUnit(Id: string,
    stateName: string,
    year: number,
    fromSource: boolean = false,
    angle: number = 0): TextContent {
    return new DecadeContent(Id, stateName, year, fromSource, angle);
  }
}

export class TimeByCenturyModelH extends TimeLineByYear {
  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    stateName: string = '',
    unitSize: number) {

    super(id,
      top,
      left,
      width,
      height,
      stateName,
      unitSize);

  }

  Init() {
    this.InitToRange(100);
  }
  TimeUnit(Id: string,
    stateName: string,
    year: number,
    fromSource: boolean = false,
    angle: number = 0): TextContent {
    return new CenturyContent(Id, stateName, year, fromSource, angle);
  }
}


export class TimeLineByHourModel {

}

export class TimeLineByDayModel {

}

export class TimeLineByWeekModel {

}

export class TimeMonthModel extends TimeLine {

  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    stateName: string = '',
    unitSize: number) {

    super(id,
      top,
      left,
      width,
      height,
      stateName,
      unitSize);

    this.Init();
 //   this._slider.SetState(new StateIndex(''));
    //  this.AddTextShapes(this._timeRange);

  }

  Init() {
    let position = Math.round(DisplayValues.Width);
    let unitSize = DisplayValues.Width / 12;
    let count = 11;
    for (; position > this.Left - this.Width; position -= unitSize) {
      let state = (count % 2 == 0) ? 'EvenSlot' : 'OddSlot';
      let c = this.TimeUnit("timelineSlot_text_" + count, state, count, false, 0);
      let s = new TextShape(
        "timelineSlot_" + count,
        this.Top,
        position - unitSize,
        unitSize, 30, state, c);
      this.AddContent(s);
      count--;
      if (count < 0) {
        count = 11;
      }
    }
  }

  Update() {
    this.Contents.forEach(c => (<MonthContent>c.Content).Update(0));
  }

  TimeUnit(Id: string,
    stateName: string,
    year: number,
    fromSource: boolean = false,
    angle: number = 0): TextContent {
    return new MonthContent(Id, stateName, year, fromSource, angle);
  }
}

export class TimeLineCoordinator {

  constructor(
    private _timeLine: TimeLine[] = []) {


    // this._timeLine
  }
}

//export class TimeLineCalendar {

//  constructor(
//    unitSize: number,
//    parentArea: Rectangle,
//    private _timeLine: TimeLineByYear) { }


//}

export class ContentRange {
  private _contentRange: ContentShape[] = [];

}
