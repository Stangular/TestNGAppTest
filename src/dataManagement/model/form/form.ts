import { IRecord } from '../records';

export interface IForm {
  formName: string;
  recordCount: number;
  content: IRecord[];
  dependentContent: IForm[];
  totalAvailableCount: number;
}
