export interface ISequenceNavigator<T> {
  SelectedIndex(): number;
  SelectItem(v: T): boolean;
  First(): boolean;
  Final(): boolean;
  Next(): boolean;
  Previous(): boolean;
  Goto(index: number): boolean;
}
