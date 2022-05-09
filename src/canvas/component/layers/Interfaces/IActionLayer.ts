import { Point } from "src/canvas/models/shapes/primitives/point";
import { Rectangle } from "src/canvas/models/shapes/rectangle";

export interface IMouseState {
  State: number;
  GetDelta(previousPosition: Point, mousePosition: Point, delta: Point): Point;
}

export class MouseStateUp implements IMouseState {

  GetDelta(previousPosition: Point, mousePosition: Point, delta: Point): Point {
    delta.SetToPosition(0, 0);
    return delta;
  }

  get State() { return 0; }
}

export class MouseStateDown implements IMouseState {

  GetDelta(previousPosition: Point, mousePosition: Point, delta: Point): Point {
    let dx = mousePosition.X - previousPosition.X;
    let dy = mousePosition.Y - previousPosition.Y;
    delta.SetToPosition(dx, dy);
    return delta;
  }

  get State() { return 1; }

}

export interface IActionItem {

  mouseState: IMouseState;
  mousePosition: Point;
  mouseCapture(event: any, boundingArea: Rectangle): Point;
  mouseMove(event: any, boundingArea: Rectangle): Point;
  mouseRelease(): void;
}

export class ActionItemsss implements IActionItem {

  protected _mousePosition: Point = new Point();
  private _previousPosition: Point = new Point();
  private _delta: Point = new Point();

  protected _mouseState: IMouseState;
  protected _mouseStateUp: MouseStateUp = new MouseStateUp();
  protected _mouseStateDown: MouseStateDown = new MouseStateDown();


  // private mouseStateOptions: IMouseState[] = [];

  constructor() {
    this._mouseState = this._mouseStateUp;
  }


  get mouseState(): IMouseState { return this._mouseState; }
  get mousePosition() { return this._mousePosition; }

  mouseCapture(event: any, boundingArea: Rectangle): Point {
    this._mouseState = this._mouseStateDown;
    this.positionFromEvent(event, boundingArea);
    this._previousPosition.SetToPosition(this.mousePosition.X, this.mousePosition.Y);
    return this.mousePosition;
  }

  mouseRelease(): void {
    this._mouseState = this._mouseStateUp;
    this._previousPosition.SetToPosition(0, 0);
    this.mousePosition.SetToPosition(0, 0);
  }

  mouseMove(event: any, boundingArea: Rectangle): Point {
    this._delta.SetToPosition(0, 0);
    this.positionFromEvent(event, boundingArea);
    this.Delta();
    this._previousPosition.SetToPosition(this.mousePosition.X, this.mousePosition.Y);
    return this._delta;
  }

  positionFromEvent(event: any, boundingArea: Rectangle): void {

    var offsetX = event.clientX - boundingArea.Left;
    var offsetY = event.clientY - boundingArea.Top;
    this.mousePosition.SetToPosition(offsetX, offsetY);
  }

  private Delta(): Point {
    this._delta = this._mouseState.GetDelta(
      this._previousPosition,
      this.mousePosition,
      this._delta);

    return this._delta;
  }

  get dX() { return this._delta.X; }
  get dY() { return this._delta.Y; }

}
