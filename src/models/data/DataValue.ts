export class ValueModel<T> {
  private value: T[] = [];
  constructor(
    private label: string,
    private field: string,
    private defaultValue: T,
    value: T) {
    this.value.push(value || defaultValue);
    }

  get Field() { return this.field; }
  get Label() { return this.label; }
  get Value() : T { return this.value[0] }
  SetValue(value: T) { this.value.unshift(value); }
  Compare(value: ValueModel<T>) { return value.Value == this.Value }
}
