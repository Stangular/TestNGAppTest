import { ImageContent } from '../Content';
import { ContentShape } from '../ContentShape';
import { ContextModel } from 'src/canvas/component/context.model';

const localImagePath = '../images/';

export class ImageShape extends ContentShape {

  constructor(
    id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    state: string,
    content: ImageContent) {
    super(id, top, left, width, height,state, content);

  }

  DrawShape(context: ContextModel): void {

    this.content.Draw(context, this);

  }

  Draw(context: ContextModel): void {

    this.DrawShape(context);
  }

  get ImageIndex() {
    return (<ImageContent>this.content).ImageIndex;
  }

  CopyShape(newID: string): ImageShape {

    return new ImageShape(newID, this.Top + 10, this.Left + 10, this.Width, this.Height,this.StateName, this.content as ImageContent);
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
      DisplayValueId: this.StateName,
      Ports: [],
      Shapes: [],
      ImageContent: {
        Id: this.content.ID,
        Content: this.content.Content,
        Code: 1,
        ParentShapeId: this.Id,
        DisplayValueId: this.content.State,
        angle: this.content.Angle
      }
    }
  }
}
