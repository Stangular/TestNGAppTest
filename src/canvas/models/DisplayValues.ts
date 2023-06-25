import { IShape } from './shapes/IShape';
import { ILine } from './lines/ILine';
import { Point } from '../models/shapes/primitives/point';
import { CanvasService } from '../service/canvas.service';
import { Rectangle } from './shapes/rectangle';

export class NamedValue<T> {

  constructor(private valueName: string = '',
    private value: T) {}

  get Name() { return this.valueName; }
  get Value() { return this.value; }

}

export enum UIStates {
  background = 0,
  foreground = 1,
  border = 2,
  color = 3,
  weight = 4,
  fontFace = 5,
  gradientColor = 6,
  gradientArea = 7,
  gradient = 8,
  stateCount = 9
}

export class StateIndex {


  constructor(
    private state: string = '',
    private index: number[] = Array.from({ length: UIStates.stateCount })) { }

  get State() { return this.state; }
  get Index() { return this.index; }

  setState(index: UIStates, value: number): boolean {
    if (index < 0 || index >= UIStates.stateCount) { return false; }
    this.index[index] = value;
    return true;
  }

  get color() {
    return this.getState(UIStates.color);
  }

  get weight() {
    return this.getState(UIStates.weight);
  }

  getState(state: UIStates) {
    return this.Index[state];
  }


}

export class DisplayValues {

  private static fgcolor: NamedValue<string>[] = [];
  private static color: NamedValue<string>[] = [];
  private static weight: NamedValue<number>[] = [];
  private static fonts: NamedValue<string>[] = [];
  private static gradientColor: NamedValue<string>[] = [];
  private static gradientArea: NamedValue<Rectangle>[] = [];
  private static gradients: NamedValue<CanvasGradient>[] = [];
  public static width: number = 0;
  public static height: number = 0;

  constructor(service: CanvasService) {
     service.RetrieveState();
  }

  static Clear() {
    this.color.length = 0;
    this.weight.length = 0;
    this.fonts.length = 0;
  }

  static get StateNames() {
    let names: string [] = [];
    this.color.forEach(function (v, i) {
      names.push(v.Name);
    });
    return names;
  }

  static SetContextItems(context: CanvasRenderingContext2D) {
    this.gradientColor.forEach(v => this.CreateGradient(v, context));
  }

  static CreateGradient(value: NamedValue<string>, context: CanvasRenderingContext2D) {
    let ga = this.gradientArea.find(g => g.Name == value.Name);
    let area = ga.Value;
    let gradient = context.createLinearGradient(area.Left, area.Top, area.Right, area.Bottom);
    let x = this.color.find(c => c.Name == value.Name);
    let clr = x.Value;
    gradient.addColorStop(0, "#232312" );
    gradient.addColorStop(.5, value.Value );
    gradient.addColorStop(.5, value.Value );
    gradient.addColorStop(1, "#232312");
    this.gradients.push(new NamedValue(value.Name, gradient));
  }

  static FGColorIndex(name: string) {
    return this.fgcolor.findIndex(c => c.Name == name);
  }

  static ColorIndex(name: string) {
    return this.color.findIndex(c => c.Name == name);
  }

  static GradientColorIndex(name: string) {
    return this.gradientColor.findIndex(c => c.Name == name);
  }

  static GradientIndex(name: string) {
    return this.gradients.findIndex(c => c.Name == name);
  }

  static GradientAreaIndex(name: string) {
    return this.gradientArea.findIndex(c => c.Name == name);
  }

  static WeightIndex(name: string) {
    return this.weight.findIndex(c => c.Name == name);
  }

  static SetGradientColor(name: string, color: string) {
    let ndx = this.GradientColorIndex(name);
    if (ndx >= 0) {
      this.gradientColor.splice(ndx, 1, new NamedValue(name, color));
    }
    else {
      this.gradientColor.push(new NamedValue(name, color));
    }
  }

  static SetGradientArea(name: string, area: Rectangle) {
    let ndx = this.GradientAreaIndex(name);
    if (ndx >= 0) {
      this.gradientArea.splice(ndx, 1, new NamedValue(name, area));
    }
    else {
      this.gradientArea.push(new NamedValue(name, area));
    }
  }

  static SetFGColor(name: string, color: string) {
    if (!name || name.length <= 0 || !color || color.length <= 0) { return; }
    let ndx = this.FGColorIndex(name);
    if (ndx >= 0) {
      this.fgcolor.splice(ndx, 1, new NamedValue(name, color));
    }
    else {
      this.fgcolor.push(new NamedValue(name, color));
    }
  }

  static SetColor(name: string, color: string) {
    if (!name || name.length <= 0 || !color || color.length <= 0) { return; }
    let ndx = this.ColorIndex(name);
    if (ndx >= 0) {
      this.color.splice(ndx, 1, new NamedValue(name, color));
    }
    else {
      this.color.push(new NamedValue(name, color));
    }
  }

  static SetWeight(name: string, weight: number) {
    let ndx = this.weight.findIndex(c => c.Name == name);
    if (ndx >= 0) {
      this.weight.splice(ndx, 1);
    }
    this.weight.push(new NamedValue(name, weight));
  }

  static SetFont(name: string, font: string) {
    let ndx = this.fonts.findIndex(c => c.Name == name);
    if (ndx >= 0) {
      this.fonts.splice(ndx, 1);
    }
    this.fonts.push(new NamedValue(name, font));
  }

  static GetFGColorByName(name: string): string {
    let ndx = this.FGColorIndex(name);
    if (ndx < 0) {
      ndx = this.FGColorIndex('default.rect.foreground');
    }
    return this.GetFGColor(ndx);
  }

  static GetColorByName(name: string) : string {
    let ndx = this.ColorIndex(name);
    if (ndx < 0) {
      ndx = this.ColorIndex('default.rect.background');
    }
    return this.GetColor(ndx);
  }

  static get Fonts() { return this.fonts; }

  static GetColor(index: number) {
    if (index >= this.color.length) {
      return this.GetColor(index - 1);
    }
    if (!index || index < 0) {
      index = 0;
    }
    return this.color[index].Value;
  }

  static GetGradient(index: number) {
    if (index >= this.gradients.length) {
      return this.GetGradient(index - 1);
    }
    if (!index || index < 0) {
      index = 0;
    }
    return this.gradients[index].Value;
  }

  static GetGradientColor(index: number) {
    if (index >= this.color.length) {
      return this.GetGradientColor(index - 1);
    }
    if (!index || index < 0) { 
      index = 0; 
    }
    return this.gradientColor[index].Value;
  }

  static GetGradientArea(index: number): Rectangle {
    if (index >= this.color.length) {
      return this.GetGradientArea(index - 1);
    }
    if (!index || index < 0) {
      index = 0;
    }
    return this.gradientArea[index].Value;
  }

  static GetFGColor(index: number) {
    if (index >= this.fgcolor.length) {
      return this.GetFGColor(index - 1);
    }
    if (!index || index < 0) { index = 0; }
    return this.fgcolor[index].Value;
  }

  static GetColorStateName(index: number) {
    if (index >= this.color.length) {
      return this.GetColor(index - 1);
    }
    if (!index || index < 0) { index = 0; }
    return this.color[index].Name;
  }

  static GetWeight(index: number) {
    if (index >= this.weight.length) {
      return this.GetWeight( index - 1 );
    }
    if (!index || index < 0 ) { index = 0; }
    return this.weight[index].Value;
  }

  static GetFont(index: number) {
    if (index >= this.fonts.length) {
      return this.GetFont(index - 1);
    }
    if (!index || index < 0) { index = 0; }
    return this.fonts[index].Value;
  }

  static GetColorFromValue(value: string) {
    let ndx = this.GetColorIndex(value);
    return this.GetColor(ndx);
  }

  static GetWeightFromValue(value: string) {
    let ndx = this.GetWeightIndex(value);
    return this.GetWeight(ndx);
  }

  static GetFontFromValue(value: string) {
    let ndx = this.GetFontIndex(value);
    return this.GetFont(ndx);
  }

  static GetColorIndex(name: string) {
    return this.color.findIndex(p => p.Name == name);
  }

  static GetWeightIndex(name: string) {
    return this.weight.findIndex(p => p.Name == name);
  }

  static GetFontIndex(name: string) {
    return this.fonts.findIndex(p => p.Name == name);
  }

  static GetLineIndex(name: string, state: string): StateIndex {
    let stateIndex = new StateIndex(name);
    let ndx = this.ColorIndex(state);
    stateIndex.setState(UIStates.color, ndx);
    ndx = this.WeightIndex(state);
    stateIndex.setState(UIStates.weight, ndx);
    return stateIndex;
  }

  static GetPortIndex(name: string,background:string, border:string): StateIndex {
    let stateIndex = new StateIndex(name);
    let ndx = this.ColorIndex(background);
    stateIndex.setState(UIStates.color, ndx);
    ndx = this.ColorIndex(border);
    stateIndex.setState(UIStates.weight, ndx);
    stateIndex.setState(UIStates.color, ndx);
   return stateIndex;
  }

  static GetShapeIndex(name: string, background: string = '', border: string = '', foreground: string = ''): StateIndex {
    if (name.length <= 0) { name = 'DefaultBG'; }
    if (background.length <= 0) { background = name; }
    if (border.length <= 0) { border = name; }

    let stateIndex = new StateIndex(name);
    stateIndex.setState(UIStates.background, this.ColorIndex(background));
    stateIndex.setState(UIStates.weight, this.WeightIndex(border));
    stateIndex.setState(UIStates.foreground, this.FGColorIndex(name));
    stateIndex.setState(UIStates.gradientColor, this.GradientColorIndex(name));
    stateIndex.setState(UIStates.gradient, this.GradientIndex(name));

    return stateIndex;
  }

  static RemoveState(stateName: string) {
    let ndx = this.GetColorIndex(stateName);
    if (ndx >= 0) {
      this.color.splice(ndx, 1);
    }
    ndx = this.GetWeightIndex(stateName);
    if (ndx >= 0) {
      this.weight.splice(ndx, 1);
    }
    ndx = this.GetFontIndex(stateName);
    if (ndx >= 0) {
      this.fonts.splice(ndx, 1);
    }
  }

  static get Height() { return this.height; }
  static get Width() { return this.width; }

}

export class TheCanvasState {

  constructor() {

    DisplayValues.Clear();
    DisplayValues.SetColor('DefaultBG', '#777777');
    DisplayValues.SetWeight('DefaultBG', 2);
    DisplayValues.SetFont('DefaultBG', 'verdana');
    DisplayValues.SetColor('DefaultFG', '#ffffff');
    DisplayValues.SetColor('default.edit.background', 'yellow');
    DisplayValues.SetWeight('default.edit.background', 2);

  }

  
}

