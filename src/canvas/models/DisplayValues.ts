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

  static SetColor(name: string, color: string) {
    this.color.push(new NamedValue(name, color));
  }

  static SetWeight(name: string, weight: number) {
    this.weight.push(new NamedValue(name, weight));
  }

  static SetFont(name: string, font: string) {
    this.fonts.push(new NamedValue(name, font));
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
    DisplayValues.SetColor('exlyrrect1border', 'pink');
    DisplayValues.SetColor('exlyrrect2bg', 'blue');
    DisplayValues.SetColor('exlyrtext1bg', 'black');
    DisplayValues.SetColor('exlyrtext1color', '#a0120c');
    DisplayValues.SetColor('transparent', 'transparent');
    DisplayValues.SetWeight('exlyrrect1border', 0.3);
    DisplayValues.SetFont('exlyrtext1font', '9px Verdana');

    DisplayValues.SetColor('toolbar.tool.background', '#d3d3d3');
    DisplayValues.SetColor('default.rect.background', '#aa00aa');
    DisplayValues.SetColor('default.edit.background', 'yellow');

  }


}

