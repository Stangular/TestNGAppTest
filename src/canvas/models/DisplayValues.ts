import { IShape } from './shapes/IShape';
import { ILine } from './lines/ILine';
import { Point } from '../models/shapes/primitives/point';
import { CanvasService } from '../service/canvas.service';

export class NamedValue<T> {

  constructor(private valueName: string = '',
    private value: T) { }

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
  stateCount = 6
}

export class StateIndex {


  constructor(
    private state: string = '',
    private index: number[] = Array.from({ length: UIStates.stateCount })) { }

  get State() { return this.state; }
  get Index() { return this.index; }

  setState(index: UIStates, value: number): boolean {
    if (index >= UIStates.stateCount) { return false; }
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

  private static color: NamedValue<string>[] = [];
  private static weight: NamedValue<number>[] = [];
  private static fonts: NamedValue<string>[] = [];

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

  static ColorIndex(name: string) {
    return this.color.findIndex(c => c.Name == name);
  }

  static WeightIndex(name: string) {
    return this.weight.findIndex(c => c.Name == name);
  }


  static SetColor(name: string, color: string) {
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
    if (!index || index < 0) { index = 0; }
    return this.color[index].Value;
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

  static GetShapeIndex(name: string, background: string = '', border: string = ''): StateIndex {
    if (name.length <= 0) { return null; }
    if (background.length <= 0) { background = name; }
    if (border.length <= 0) { border = background; }
    let stateIndex = new StateIndex(name);
    let ndx = this.ColorIndex(background);
    stateIndex.setState(UIStates.background, ndx);
    ndx = this.ColorIndex(border);
    stateIndex.setState(UIStates.weight, ndx);
    stateIndex.setState(UIStates.foreground, ndx);
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

