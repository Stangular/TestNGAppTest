import { IIndexer } from '../Interface/IIndexer';

export interface IPager {
  Page() : number;
  PageSize(): number;
  ItemCount(): number;
  PageCount(): number;

  First(): number;
  Final(): number;
  Next(): number;
  Back(): number;
  Step(by: number): number;
  Goto(index: number): number;
}
