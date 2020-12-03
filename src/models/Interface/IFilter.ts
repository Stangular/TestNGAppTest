export interface IFilter {
  setFilter(data: any): void;
  filterAction(item: any): boolean;
  filterName(): string;
}
