import { IShape } from "../IShape";
import { ContextModel } from "src/canvas/component/context.model";
import { Shape } from "../shape";
import { StateIndex, DisplayValues } from "../../DisplayValues";

export abstract class Content {
  protected _stateIndex: StateIndex = null;

  constructor(protected Id: string,
    protected stateName: string,
    protected content: string,
    protected fromSource: boolean = false,
    protected angle: number = 0) {
    this._stateIndex = DisplayValues.GetShapeIndex(this.stateName);

  }

  abstract Draw(context: ContextModel,shape: Shape);
  get ID() { return this.Id; }
  get State() { return this.stateName; }
  get Content() { return this.content; }
  get Angle() { return this.angle; }
  get FromSource() { return this.fromSource; }
  get StateIndex() { return this._stateIndex; }

}

export class TextContent extends Content {
  constructor(Id: string,
    stateName: string,
    content: string,
    fromSource: boolean = false,
    angle: number = 0) {
    super(Id,
      stateName,
      content,
      fromSource,
      angle);
  }

  public Draw(context: ContextModel, shape: Shape) {
    context.DrawText(this,shape);
  }
}

export class ImageContent extends Content {
  constructor( Id: string,
     stateName: string,
    content: string,
    fromSource: boolean = false,
     angle: number = 0,
    protected imageIndex: number = 0) {
    super(Id,
      stateName,
      content,
      fromSource,
      angle);
      
  }

  public Draw(context: ContextModel, shape: Shape) {
    context.DrawImage(shape, this.imageIndex);
  }

  get ImageIndex() {
    return this.imageIndex;
  }
}



