
export default interface IMongoField {
  name: string;
  value: any;
}

export default interface IMongoForm {
  fields: IMongoField[];
}
