export class ChartContentModel {
  constructor(
    private id: string,
    private minValue: number,
    private maxValue: number,
    private value: number,
    private dataCount: number,
    private staticAxisSize: number = 0,
    private variableAxisSize: number = 0,
    private staticAxisUnitSize: number = 0) {

    this.ResetStaticUnitSize(staticAxisSize, variableAxisSize);

  }

  ResetStaticUnitSize(staticAxisSize: number, variableAxisSize: number) {
    this.staticAxisSize = staticAxisSize;
    this.staticAxisUnitSize = ((this.staticAxisSize / this.dataCount) * 80) / 100;
    this.variableAxisSize = variableAxisSize;
  }

  get StaticAxisSize() {
    return this.staticAxisSize;
  }

  get VariableAxisSize() {
    return this.variableAxisSize;
  }

  get StaticAxisValue() {
    return (this.staticAxisUnitSize);
  }

  get VariableAxisValue() {
    return ((this.value / this.maxValue) * this.variableAxisSize);
  }

}
