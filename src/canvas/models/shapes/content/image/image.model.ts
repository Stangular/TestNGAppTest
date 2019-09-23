export class ImageModel {

  private path: string;
  private name: string;
  private lastModified: Date;
  private size: number;

  constructor(path: string) {
    let p = path.split('\\');
    this.name = p[p.length-1];
  }

  get Path() {
    return '../Images/' + this.Name;
  }

  get List() {
    return '../Images/';
  }
  get Name() { return this.name; }
  get ModifiedOn() { return this.lastModified; }
  get Size() { return this.size; }

}
