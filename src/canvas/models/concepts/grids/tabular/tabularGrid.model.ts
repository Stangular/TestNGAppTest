import { ContextLayer, IContextItem, IContextSystem } from "src/canvas/models/IContextItem";
import { Rectangle } from "src/canvas/models/shapes/rectangle";
import { DisplayValues } from "src/canvas/models/DisplayValues";
import { Ellipse } from "src/canvas/models/shapes/ellipse";
import { Port } from "src/canvas/models/shapes/port";
import { lineTypes } from "src/canvas/models/lines/line";
import { Point } from "src/canvas/models/shapes/primitives/point";

export class TimeLineBaseLayerModel extends ContextLayer {

  constructor(
    parentArea: Rectangle, 
    private _endDate: Date, // date to count back from
    private _span: number, // number of units to include
    private _size: number, // size of time line unit?   level: time part counting from...
    private _level: number) {

    super(parentArea
      , 'timelinesss'
      , 'timelinesss'
      , 'sss'
      , new Date()
      , ''
      , [new Rectangle('timeline', 0, 0, -1, 10, 'timeline')]);

    DisplayValues.Clear();
    DisplayValues.SetColor('DefaultBG', '#ddd11d');
    DisplayValues.SetColor('EvenSlot', '#fffff2');
    DisplayValues.SetColor('OddSlot', '#fbf7f5');

    DisplayValues.SetWeight('DefaultBG', 2);
    DisplayValues.SetFont('DefaultBG', 'verdana');
    DisplayValues.SetColor('DefaultFG', '#000000');
    DisplayValues.SetColor('default.edit.background', 'yellow');
    DisplayValues.SetWeight('default.edit.background', 2);
    DisplayValues.SetColor('timeLineColor', 'red');
    //  this.GetContentItem
    //PortPath.
    this.AddLine("timeline", "timeLineColor", lineTypes.straight);
    //   this.Set();
    //   (<Rectangle>this.Content[0].).AddPort().

  }

  Init() {
    this.ClearContent(1);
    this.ClearPaths();

    let area = this.Content[0] as Rectangle;
    let offset = Math.round(DisplayValues.Width);
    let sz = offset / this._span;
    let cnt = 1;
    let port1;// = new Ellipse("timelineA_1", area.Top, offset, 1, 1, 'DefaultBG');
    let port2;//// = new Ellipse("timelineB_1", area.Bottom, offset, 1, 1, 'DefaultBG');

    //  new Port("timelineA_1", 0, 0, port1, ePortType.source, 'DefaultBG', 'timelineA', 0);
    //   new Port("timelineB_1", 0, 0, port2, ePortType.target, 'DefaultBG', 'timelineA', 1);
    let p1;// = new Port("timelineA_" + cnt, 0, 0, port1, ePortType.source, 'DefaultBG', 'timelinePath_' + cnt, 0);
    let p2;// = new Port("timelineB_" + cnt, 0, 0, port2, ePortType.target, 'DefaultBG', 'timelinePath_' + cnt, 1);


    //  area.AddPort(p1);
    //  area.AddPort(p2);
    let ports: Point[] = [];
    //  ports.push(port1.Center);
    //  ports.push(port2.Center);
   // this.AddPath('timelinePath_1', 'timeline', ports);
    let d = new Date();
    let y = d.getFullYear();
    for (; offset > area.Left; offset -= sz) {
      cnt++;
      //port1 = new Ellipse("timelineA_" + cnt, area.Top, offset, 1, 1, 'DefaultBG');
      //port2 = new Ellipse("timelineB_" + cnt, area.Bottom, offset, 1, 1, 'DefaultBG');
      //p1 = new Port("timelineA_" + cnt, 0, 0, port1, ePortType.source, 'DefaultBG', 'timelinePath_' + cnt, 0);
      //p2 = new Port("timelineB_" + cnt, 0, 0, port2, ePortType.target, 'DefaultBG', 'timelinePath_' + cnt, 1);
      //ports = [];
      //ports.push(port1.Center);
      //ports.push(port2.Center);
      //this.AddPath('timelinePath_' + cnt, 'timeline', ports);

      ////    new Port("timelineA_" + cnt, 0, 0, port1, ePortType.source, 'DefaultBG', 'timelinePath_' + cnt, 0);
      ////   new Port("timelineB_" + cnt, 0, 0, port2, ePortType.target, 'DefaultBG', 'timelinePath_' + cnt, 1);
      ////    this.AddPath
      //area.AddPort(p1);
      //area.AddPort(p2);
      //if (cnt % 2 == 0) {
      //  this.AddContent(new Rectangle("timelineSlot_" + cnt, area.Bottom + 1, offset - sz, sz, 30, 'EvenSlot'));
      //  this.AddText(y.toString(), 'EvenSlot', 'DefaultFG', false);

      //}
      //else {
      //  this.AddContent(new Rectangle("timelineSlot_" + cnt, area.Bottom + 1, offset - sz, sz, 30, 'OddSlot'));
      //  this.AddText(y.toString(), 'OddSlot', 'DefaultFG', false);

      //}
      y = y - 1;
    }
  }
}
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
