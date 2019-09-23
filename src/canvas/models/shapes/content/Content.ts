
export class Content {

  constructor(protected Id: string,
    protected stateName: string,
    protected content: string,
    protected contentCode: number,
    protected angle: number = 0) {
  }

  get ID() { return this.Id; }
  get State() { return this.stateName; }
  get Content() { return this.content; }
  get Code() { return this.contentCode; }
  get Angle() { return this.angle; }

}
