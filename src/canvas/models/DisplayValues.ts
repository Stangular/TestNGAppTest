import { IShape } from './shapes/IShape';
import { ILine } from './lines/ILine';
import { Point } from '../models/shapes/primitives/point';

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
}

export class DisplayValues {

  private static color: NamedValue<string>[] = [];
  private static weight: NamedValue<number>[] = [];
  private static fonts: NamedValue<string>[] = [];
  private static ports: {}[] = [];
  static Clear() {
    this.color.length = 0;
    this.weight.length = 0;
    this.fonts.length = 0;
  }

  static ColorIndex(name: string) {
    return this.color.findIndex(c => c.Name == name);
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

  static GetColor(index: number) {
    return this.color[index].Value;
  }

  static GetWeight(index: number) {
    return this.weight[index].Value;
  }

  static GetFont(index: number) {
    return this.fonts[index].Value;
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

}

export class TheCanvasState {

  constructor() {

    DisplayValues.Clear();
    DisplayValues.SetColor('exlyrrect1bg', 'red');
    DisplayValues.SetColor('exlyrrect1border', 'black');
    DisplayValues.SetColor('exlyrrect2bg', 'blue');
    DisplayValues.SetColor('exlyrtext1bg', 'black');
    DisplayValues.SetColor('exlyrtext1color', '#a0120c');
    DisplayValues.SetColor('transparent', 'red');
    DisplayValues.SetWeight('exlyrrect1border', 1.0);
    DisplayValues.SetFont('exlyrtext1font', '9px FontAwesome');

    DisplayValues.SetColor('toolbar.tool.background', '#d3d3d3');
    DisplayValues.SetColor('toolbar.tool.background_selected', '#708090');

    DisplayValues.SetColor('default.rect.background', '#aa00aa');
    DisplayValues.SetColor('default.edit.background', 'yellow');
    DisplayValues.SetFont('toolbarfont', '14px FontAwesome');

  }


}

