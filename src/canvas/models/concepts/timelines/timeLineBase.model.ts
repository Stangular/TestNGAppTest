import { Rectangle } from "../../shapes/rectangle";
import { IShape } from "../../shapes/IShape";
import { ContextLayer, ActionLayer, EventContextLayer } from "../../IContextItem";
import { DisplayValues } from "../../DisplayValues";
import { lineTypes } from "../../lines/line";
import { Ellipse } from "../../shapes/ellipse";
import { Port, ePortType } from "../../shapes/port";
import { Point } from "../../shapes/primitives/point";
import { IActionItem, ActionItemsss } from "src/canvas/component/layers/Interfaces/IActionLayer";
import { Action } from "rxjs/internal/scheduler/Action";
import { TextContent } from "../../shapes/content/Content";
import { Text } from "@angular/compiler";
import { TextShape } from "../../shapes/content/text/text";
import { ITimeLine, TimeLineByYearModelH, TimeByDecadeModelH, TimeByCenturyModelH, YearContent, TimeMonthModel, TimeLine, TimeLineSlider } from "src/components/timeline/service/timeLine.model";
import { ContextModel } from "src/canvas/component/context.model";
import { TimeLineSpanLayerModel } from "./timeLineSpan.model";
import { Shape } from "../../shapes/shape";

export enum TimeLineTypes {
  year = 0,
  decade = 1,
  century = 2,
  month = 3
}

export class TimeLineBaseLayerModel extends EventContextLayer {

  //  private _contextOffset = 0;
  //_timeLine: ITimeLine[] = [];
 // protected _activeSlider: TimeLineSlider = null;

  constructor(
    parentArea: Rectangle,
    private _endDate: Date, // date to count back from
    private _span: number, // number of units to include
    private _size: number, // size of time line unit?   level: time part counting from...
    private _level: number,
    private _timeLineType: TimeLineTypes = TimeLineTypes.year) {

    super(
      parentArea,
      'timeline'
      , 'timeline'
      , 'sss'
      , new Date()
      , '');
    this.ResetTimeLine(this.ParentArea, this._timeLineType);
  }

  ResetTimeLine(parentArea: Rectangle, timeLineType: TimeLineTypes = TimeLineTypes.year): void {
    this.ClearContent();
    //    this.AddContent(new TimeLineSlider("year", 0, 100, 80, 300));
    switch (timeLineType) {
      case TimeLineTypes.century:
        this.AddContent(new TimeByCenturyModelH('timeline1', 0, 0, parentArea.Width, 30, 'boundingArea', 100));
        break;
      case TimeLineTypes.decade:
        this.AddContent(new TimeByDecadeModelH('timeline1', 0, 0, parentArea.Width, 30, 'boundingArea', 100));
        break;
      default:
        this.AddContent(new TimeLineByYearModelH('timeline_year', 0, 0, parentArea.Width, 30, 'boundingArea', 100));
        this.AddContent(new TimeLineSlider('timelineSpan_timeline_year', 0, 100, 80, 60));
        this._sizer.Reset(this.Content[1] as IShape);
 //    this.AddContent(new TimeMonthModel('timeline_month', 40, 0, this.parentArea.Width, 30, 'boundingArea', 100));
    }
    this._timeLineType = timeLineType;

  }

  get TimeLineType() { return this._timeLineType; }

  resetTimeLine() {
    this.Content[0]
  }

  Area(which: number = 0) {
    return this.Content[which] as Rectangle;
  }

  ////get parentArea(): Rectangle {
  ////  return this.Content[0] as Rectangle;
  ////}
  

  //mouseMove(event: any, boundingArea: Rectangle, context: CanvasRenderingContext2D): Point {
  //  // this.content.forEach(c => (<Rectangle>c))
  //  //   if (!this._selectedItem) { return null; }

  //  let d = super.mouseMove(event, boundingArea, context);
  // // this._sizer.MoveItem(d.X, d.Y);
  //  //this.Content.forEach(c => (<Shape>c).MoveIfHit(d));
  //  let result = this.Content.filter(c => (<Shape>c).IsHit)
  //  result.forEach(c => (<Shape>c).ShiftContent(d, boundingArea.Right));
  //  return d;
  //}

  //get mouseState(): number {
  //  return this._timeLine.mouseState;
  //}

  //get mousePosition(): Point {
  //  return this._timeLine.mousePosition;
  //}

  //mouseCapture(event: any, area: Rectangle = null): Point {
  //  return this._timeLine.mouseCapture(event, this.parentArea);
  //}

  //mouseRelease(): void {
  //  this._timeLine.mouseRelease();
  //}

  //mouseMove(event: any, boundingArea: Rectangle = null): Point {

  //  return this._timeLine.mouseMove(event, this.parentArea);
  //}
}
 // Init() {
 //   this.ClearContent(1);
 //   this.ClearPaths();

 //   let area = this.Content[0] as Rectangle;
 //   let offset = Math.round(DisplayValues.Width);
 //   let sz = offset / this._span;

 //   let cnt = 1;
 //   let port1;// = new Ellipse("timelineA_1", area.Top, offset, 1, 1, 'DefaultBG');
 //   let port2;//// = new Ellipse("timelineB_1", area.Bottom, offset, 1, 1, 'DefaultBG');

 //   //  new Port("timelineA_1", 0, 0, port1, ePortType.source, 'DefaultBG', 'timelineA', 0);
 //   //   new Port("timelineB_1", 0, 0, port2, ePortType.target, 'DefaultBG', 'timelineA', 1);
 //   let p1;// = new Port("timelineA_" + cnt, 0, 0, port1, ePortType.source, 'DefaultBG', 'timelinePath_' + cnt, 0);
 //   let p2;// = new Port("timelineB_" + cnt, 0, 0, port2, ePortType.target, 'DefaultBG', 'timelinePath_' + cnt, 1);

 //   //  area.AddPort(p1);
 //   //  area.AddPort(p2);
 //   let ports: Point[] = [];
 //   //  ports.push(port1.Center);
 //   //  ports.push(port2.Center);
 //   this.AddPath('timelinePath_1', 'timeline', ports);
 //   let d = new Date();
 //   let y = d.getFullYear();

 //   // this._temporalOffset += ((y - 1850) * sz);

 //   let ya = Math.round(this._temporalOffset / sz);
 //   y -= ya;
 //   if (y > d.getFullYear()) {
 //     y = d.getFullYear();
 //     offset = Math.round(DisplayValues.Width);
 //     this._temporalOffset = 0;
 //   }
 //   else {
 //     ya--;
 //     offset += this._temporalOffset - (ya * sz);
 //     y++;
 //   }
 //   for (; offset > area.Left; offset -= sz) {
 //     cnt++;
 //  //   port1 = new Ellipse("timelineA_" + cnt, area.Top, offset, 1, 1, 'DefaultBG');
 //  //   port2 = new Ellipse("timelineB_" + cnt, area.Bottom, offset, 1, 1, 'DefaultBG');
 //   //  p1 = new Port("timelineA_" + cnt, 0, 0, port1, ePortType.source, 'DefaultBG', 'timelinePath_' + cnt, 0);
 //  //   p2 = new Port("timelineB_" + cnt, 0, 0, port2, ePortType.target, 'DefaultBG', 'timelinePath_' + cnt, 1);
 //     ports = [];
 //  //   ports.push(port1.Center);
 ////     ports.push(port2.Center);
 ////     this.AddPath('timelinePath_' + cnt, 'timeline', ports);

 //     //    new Port("timelineA_" + cnt, 0, 0, port1, ePortType.source, 'DefaultBG', 'timelinePath_' + cnt, 0);
 //     //   new Port("timelineB_" + cnt, 0, 0, port2, ePortType.target, 'DefaultBG', 'timelinePath_' + cnt, 1);
 //     //    this.AddPath
 // //    area.AddPort(p1);
 // //    area.AddPort(p2);
 //     let state = (cnt % 2 == 0) ? 'EvenSlot' : 'OddSlot';
 //     let c = new TextContent("timelineSlot_text_" + cnt, state, y.toString());
 //     area.AddTextShape(new TextShape("timelineSlot_" + cnt, area.Top + 5, offset - sz, sz, 30, state, c));
 //     y = y - 1;
 //   }
 // }
//}
//area.AddPort(new Ellipse("timelineA_1", area.Top, area.Width, 1, 1, 'DefaultBG'));
//area.AddPort(new Ellipse("timelineB_1", area.Bottom, area.Width, 1, 1, 'DefaultBG'));

//// this.AddPortPath
////  this.AddPortPath
//while (offset > 0) {
//  cnt++;
//  area.AddPort(new Ellipse("timelineA_" + cnt, area.Top, offset, 1, 1, 'DefaultBG'));
//  area.AddPort(new Ellipse("timelineB_" + cnt, area.Bottom, offset, 1, 1, 'DefaultBG'));
//  offset -= sz;
//}
