import { TextContent } from '../Content';
import { ContentShape } from '../ContentShape';
import { ContextModel } from 'src/canvas/component/context.model';

export class TextShape extends ContentShape {

  constructor(
    id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    state: string,
    content: TextContent) {
    super(id, top, left, width, height,state,content);
  }

  DrawShape(context: CanvasRenderingContext2D): void {
    this.content.Draw(context,this);
  }

  SizeBy(context: CanvasRenderingContext2D, top: number, right: number, bottom: number, left: number) {
    right = left + 10; // this.Content.MeasureText(ctx,this.Height, this.StateIndex) + 10;
    super.SizeBy( context,top, right, bottom, left);
  }

  Draw(context: any): void {
    this.DrawShape(context);
  }
  
  CopyShape(newID: string): TextShape {

    return new TextShape(newID, this.Top + 10, this.Left + 10, this.Width, this.Height, this.StateName, this.content as TextContent);
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
      TextContent: {
        Id: this.content.Id,
        Content: this.content.Content,
        Code: 0,
        ParentShapeId: this.Id,
        DisplayValueId: this.content.State,
        angle: this.content.Angle
      }
    }
  }
}
