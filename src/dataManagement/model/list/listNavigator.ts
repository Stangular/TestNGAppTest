export interface IListNavigator<T> {
    SelectedIndex(): number;
    SelectItem(ID: T): boolean;
    First(): boolean;
    Final(): boolean;
    Next(): boolean;
    Previous(): boolean;
}