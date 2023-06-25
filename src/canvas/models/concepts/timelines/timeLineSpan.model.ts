import { Rectangle } from "../../shapes/rectangle";
import { IShape } from "../../shapes/IShape";
import { ContextLayer, ActionLayer } from "../../IContextItem";
import { DisplayValues } from "../../DisplayValues";
import { lineTypes } from "../../lines/line";
import { Ellipse } from "../../shapes/ellipse";
import { Port } from "../../shapes/port";
import { Point } from "../../shapes/primitives/point";
import { IActionItem, ActionItemsss, IMouseState } from "src/canvas/component/layers/Interfaces/IActionLayer";
import { Action } from "rxjs/internal/scheduler/Action";

export class TimeLineSpanLayerModel extends ContextLayer implements IActionItem {

 // _actionItem: ActionItemsss;
  _hit: boolean = false;

  constructor(boundingArea: Rectangle) {

    super(boundingArea
      , 'timespan'
      , 'timespan'
      , 'sss'
      , new Date()
      , ''
      , [new Rectangle("timelineSpan", 0, 100, 80, 90, 'TimeSpansss')]);

   // this._actionItem = new ActionItemsss(boundingArea);

  //  this.AddContent(new Rectangle("timelineSpan", 0, 100, 50, 80, 'TimeSpansss'));

  }

  resetArea(boundingArea: Rectangle) {
 //   this._actionItem.resetBounding(boundingArea);

  }
  get mouseState(): IMouseState {
    return null; // this._actionItem.mouseState;
  }

  get mousePosition(): Point {
    return new Point(); // this._actionItem.mousePosition;
  }

  mouseCapture(event: any): Point {
    let span = this.content[0] as Rectangle;
   // let hit = this._actionItem.mouseCapture(event);
   // this._hit = span.IsPointInShape(hit);
    return 
   // span.IsHit
  //  span.Select

  }

  get Hit(): boolean {
    return this._hit;
  }

  mouseRelease(): void {
   // this._actionItem.mouseRelease();
  }

  //get parentArea(): Rectangle {
  //  return this.Content[0] as Rectangle;
  //}

  mouseMove(event: any): Point {
    let d = new Point(); //this._actionItem.mouseMove(event, this.parentArea);
    //if (this._hit && d.X != 0 ) {
    //  let span = this.content[0] as Rectangle;
    //  span.MoveBy(d.X, 0);
    //}
    return d;
  }

  Init() {}
}
