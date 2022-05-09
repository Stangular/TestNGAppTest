import { Records } from "src/dataManagement/model/records";
import { Field } from "src/dataManagement/model/field";
import { IElementDefinition, ElementModelFactory } from "src/dataManagement/model/definitions/ElementDefinition";

export class FormFilterBase extends Records<string> {


  constructor(

    formName: string = "formFilterBase"
    , fields: Field<any>[] = []) {
    super(formName, 1000, "formFilterBase", fields);

  }

  GetFormDefinition(): IElementDefinition[] {
    return null;
  }

  New(data: any): Field<any> {
    return null;
  }

  UpdateDependentUI(): void {

  }

  GetUIValue(fieldID: string): any {
  }

  OutputAll(): any {
    return null;
  }

  ChartData(chartID: string): { xparam: number, yparam: number }[] {
    return null;
  }

  ChartGraphic(chartID: string, width: number, height: number, chartName: string) {

  }
  ChartIDFrom(chartNumber: number) {

  }

  AddFieldFromModel(models: ElementModelFactory) {

  }

}
