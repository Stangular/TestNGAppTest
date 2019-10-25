import { IShape } from '../../IShape';
import { Shape } from '../../shape';
import { IContextItem, ContextSystem } from '../../../IContextItem';
import { DisplayValues, StateIndex, UIStates } from '../../../DisplayValues'
import { Point } from '../../primitives/point';
import { ShapeSelectResult } from '../../shapeSelected';
import { Rectangle } from '../../rectangle';
import { Content } from '../Content';
import { ContextModel } from 'src/canvas/component/context.model';

const localImagePath = '../images/';

export class ContentImage extends Shape {

  constructor(
    id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    protected content: Content,
    private imageIndex: number = -1) {
    super(id, top, left, 100, 100, content.State);

  }

  DrawShape(context: ContextModel): void {
   
    context.DrawImage(this);

  }

  Draw(context: ContextModel): void {

    this.DrawShape(context);
  }

  get ImageIndex() {
    return this.imageIndex;
  }

  CopyShape(newID: string): ContentImage {

    return new ContentImage(newID, this.Top + 10, this.Left + 10, this.Width, this.Height, this.content, this.imageIndex);
  }

  CopyItem(newID: string) {
    return this.CopyShape(newID);
  }

  Save(): any {

    return {
      Id: this.Id,
      Top: Math.ceil(this.Top),
      Left: Math.ceil(this.Left),
      Width: Math.ceil(this.width),
      Height: Math.ceil(this.height),
      Type: 0,
      CornerRadius: 0,
      Shadow: 0,
      DisplayValueId: '',
      Ports: [],
      Shapes: [],
      Content: {
        Id: this.content.ID,
        Content: this.content.Content,
        Code: this.content.Code,
        ParentShapeId: '',
        DisplayValueId: this.content.State,
        angle: this.content.Angle
      }
    }
  }
}
