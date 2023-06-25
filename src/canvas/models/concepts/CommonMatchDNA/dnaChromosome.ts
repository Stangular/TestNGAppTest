import { EventContextLayer, IContextItem, ContextLayer } from "../../IContextItem";
import { Rectangle } from "../../shapes/rectangle";
import { lineTypes } from "../../lines/line";
import { Ellipse } from "../../shapes/ellipse";
import { Port } from "../../shapes/port";
import { Observable } from "rxjs";
import { forEach } from "@angular/router/src/utils/collection";
export class SegmentRange implements IContextItem {
  constructor(
    private id: string,
    private first: number,
    private final: number) { }

  get First() { return this.first; }
  get Final() { return this.final; }

  TestOverlap(range: SegmentRange): boolean {
    return !(range.Final < this.first || range.First > this.final);
  }

  get Range(): number { return this.final - this.first; }

  get Id() { return this.id; }
  get zIndex() { return 0; }

  CopyItem(newId: string): IContextItem {
    return null;
  }

  Save(): any {
    return '';
  }

  Draw(contextModel) {

  }

  AddContent(context: ContextLayer, parentArea: Rectangle, top: number) {


    let pathId = 'dnaSegmentPath_' + this.id + "_path";


    let port1 = new Ellipse(pathId + "_A", top, this.first, 1, 1, 'personPort');
    let port2 = new Ellipse(pathId + "_A", top, this.final, 1, 1, 'personPort');

    let p1 = new Port("segmentPath_A_" + this.Id, 0, 0, '', "dnasegmentpath", 'personPort', port1, 0);
    let p2 = new Port("segmentPath_B_" + this.Id, 0, 0, '', "dnasegmentpath", 'personPort', port2, 1);

    let ports = [];
    ports.push(p1);
    ports.push(p2);

    context.PortPath.AddPorts(ports);

    //parentArea.AddPort(p1);
    //parentArea.AddPort(p2);




  }
}

export class Chromosome implements IContextItem {
  private offsets: SegmentRange[] = [];
  private _size: number;
  constructor(private position: number) {
    this._size = this.GetChromosomeSize();
  }

  get Position() { return this.position; }

  AddRange(matchId: string, first: number, final: number) {
    this.offsets.push(new SegmentRange(matchId, first, final));
  }

  Order() {
    this.offsets.sort((a, b) => a.First - b.First);
  }
  get Id() { return this.position.toString(); }
  get zIndex() { return 0; }

  CopyItem(newId: string): IContextItem {
    return null;
  }

  Save(): any {
    return '';
  }

  Draw(contextModel) {

  }

  GetOverlapCount(index: number, offset: SegmentRange): number {
    let cnt = 0;
    for (let j = index; j >= 0; j--) {
      if (offset.TestOverlap(this.offsets[j])) {
        cnt = this.GetOverlapCount(j - 1, this.offsets[j]);
        cnt += 1;
        break;
      }
    }
    return cnt;
  }
  AddContent(context: ContextLayer, parentArea: Rectangle) {
    let conversion = parentArea.Width / this._size;
    let self = this;
    // draw all that do not overlap
    let y = 20;
    for (let i = 0; i < this.offsets.length; i++) {
      let o1 = this.offsets[i];
      y *= (this.GetOverlapCount(i - 1, o1)) + 1;
      //for (let j = i-1; j >= 0; j--) {
      //  let o2 = this.offsets[j];
      //  if (o1.TestOverlap(o2)) {
      //    y += 20;
      //  }
      //}
      //o1.AddContent(context, parentArea, self.position.toString(), conversion, y);
      y = 20;
    }
    //this.offsets.forEach(function (o, i) {
    //  let j = (i + 1) * 2;
    //  o.AddContent(context, parentArea, self.position.toString(), conversion, j * self.position);
    //});
  }
  //from https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6391780/
  GetChromosomeSize() {

    let size = 0;
    switch (this.position) {
      case 1: size = 248956422; break;
      case 2: size = 242193529; break;
      case 3: size = 198295559; break;
      case 4: size = 190214555; break;
      case 5: size = 181538259; break;
      case 6: size = 170805979; break;
      case 7: size = 159345973; break;
      case 8: size = 145138636; break;
      case 9: size = 138394717; break;
      case 10: size = 133797422; break;
      case 11: size = 135086622; break;
      case 12: size = 133275309; break;
      case 13: size = 114364328; break;
      case 14: size = 107043718; break;
      case 15: size = 101991189; break;
      case 16: size = 90338345; break;
      case 17: size = 83257441; break;
      case 18: size = 80373285; break;
      case 19: size = 58617616; break;
      case 20: size = 64444167; break;
      case 21: size = 46709983; break;
      case 22: size = 50818468; break;
    }

    return size;
  }

}

export class DNAMap implements IContextItem {

  private chromosomes: Chromosome[] = [];

  constructor(private memberId: string) {
    for (let i = 1; i <= 23; i++) {
      this.chromosomes.push(new Chromosome(i));
    }
  }

  AddSegment(matchId: string, segment: DNASegment) {
    let chromosome = this.chromosomes.find(c => c.Position == segment.Chromosome);
    if (chromosome) {
      chromosome.AddRange(matchId, segment.Offset1, segment.Offset2);

    }
  }

  AddSegments(matchId: string, segments: DNASegment[]) {
    segments.forEach(s => this.AddSegment(matchId, s));
  }

  Order() {
    this.chromosomes.forEach(c => c.Order());
  }
  get Id() { return this.memberId; }
  get zIndex() { return 0; }

  CopyItem(newId: string): IContextItem {
    return null;
  }

  Save(): any {
    return '';
  }

  Draw(contextModel) {

  }
  AddContent(context: ContextLayer, parentArea: Rectangle) {
    this.chromosomes[5].AddContent(context, parentArea);
    //  this.chromosomes.forEach( c => c.AddContent(context, parentArea));
  }

}


export class ItemCount {
  constructor(
    private itemName: string,
    private count: number = 1) { }

  get ItemName(): string { return this.itemName; }
  get Count(): number { return this.count; }

  UpdateCount(name: string, updateBy = 1): boolean {
    if (name == this.itemName) {
      this.count += updateBy;
      return true;
    }
    return false;
  }
}

export class CommonMatchPiles {
  _commonfamilies: string[] = [];
  public pileByMember: {
    matchId: string, segments: { memberID: string, piles: { pile: string, size: number }[] }[]
  }[] = [];

  AddCommonFamilies(families: Surname[]) {

  }
}

export class DNASegment {
  private _segmentContext: SegmentRange;
  private _size: number;
  private _pile: DNASegment[] = [];
  private _piled: boolean = false;
  private commonSurnames: ItemCount[] = [];
  constructor(
    private chromosome: number,
    protected offset1: number,
    protected offset2: number,
    protected cm: number,
    protected snp: number,
    protected matchId: string) {
    this._size = this.offset2 - this.offset1;
  }

  PileSize(): number {
    let sz = this.Size;
    this._pile.forEach(s => sz += s.PileSize());
    return sz;
  }
  Pile() { this._piled = true; }

  get IsPiled() { return this._piled; }

  get MatchID(): string {
    return this.matchId;
  }
  get Chromosome(): number {
    return this.chromosome;
  }
  get Offset1(): number {
    return this.offset1;
  }

  get Offset2(): number {
    return this.offset2;
  }

  get cM(): number {
    return this.cm;
  }

  get SNP(): number {
    return this.snp;
  }

  get Size(): number {
    return this._size;
  }

  CreateCluster(memberId: string, cluster: MatchCluster, matches: CommonMatch[] = []) {
    cluster.AddPrimaryMatch(memberId,this,matches);
    this._pile.forEach(s => s.CreateCluster(memberId,cluster,matches));
  }

  NotInGroup(segments: DNASegment[]) {
    return segments.filter(s => !s.Compare(this));
  }

  InGroup(segments: DNASegment[]) {
    return segments.findIndex(s => s.Compare(this));
  }

  Compare(segment: DNASegment) {
    return segment.Chromosome == this.chromosome
      && segment.Offset1 == this.offset1
      && segment.Offset2 == this.offset2;
  }

  private OverlapTest(segment: DNASegment) {// assumes same chromosome number
    return !(segment.Offset1 > this.Offset2 || segment.Offset2 < this.Offset1);
  }

  private OverlapsTest(segments: DNASegment[]) {// assumes same chromosome number
    return segments.filter(s => s.OverlapTest(this));
  }

  private NotOverlapsTest(segments: DNASegment[]) {// assumes same chromosome number
    return segments.filter(s => !s.OverlapTest(this));
  }

  Overlap(segment: DNASegment) {
    if (segment.Chromosome != this.chromosome) { return false; }
    return this.OverlapTest(segment);
  }

  Overlaps(segments: DNASegment[]): DNASegment[] {
    return segments
      .filter(s => s.Chromosome == this.chromosome)
      .filter(s => this.OverlapTest(s));
  }

  CommonSurnames(surnames: Surname[]): ItemCount[] {

    this._pile.forEach(function (s, i) {
      s.CommonSurnames(surnames);
      let sss = 0;
      sss = 1;
    });
    let self = this;
    let forThisMatch = surnames.filter(n => n.Matches.findIndex(m => m == this.matchId) >= 0);
    forThisMatch.forEach(function (m, i) {

      let surname = self.commonSurnames.find(c => c.ItemName == m.Name);
      if (surname) {
        surname.UpdateCount(m.Name);
      }
      else {
        self.commonSurnames.push(new ItemCount(m.Name));
      }
    });
    //  this.commonSurnames = this.commonSurnames.sort((a, b) => b.Count - a.Count);
    return this.commonSurnames.sort((a, b) => b.Count - a.Count);
  }

  CommonMemberSegments(mid: string) {
    let result = false;
    let m = this.matchId.toLowerCase();
    m = m.replace(/\s/g, "");
    if (mid.indexOf(m) >= 0) {
      result = true;
    }
    else {
      let len = this._pile.length;
      for (let i = 0; i < len; i++) {
        result = this._pile[i].CommonMemberSegments(mid);
        if (result) {
          break;
        }
      }
    }
    return result;
  }

  GetCommonMemberSegment(mid: string): DNASegment {
    let result: DNASegment = null;
    if (mid.indexOf(this.matchId) >= 0) {
      return this;
    }
    else {
      let len = this._pile.length;
      for (let i = 0; i < len; i++) {
        result = this._pile[i].GetCommonMemberSegment(mid);
        if (result) {
          break;
        }
      }
    }
    return result;
  }

  //GetCommonMemberSegmentsss(): MatchCluster[] {
  //  let result: MatchCluster[] = [];
  //  let len = this._pile.length;
  //  //for (let i = 0; i < len; i++) {
  //  //  result.push(new MatchCluster( this._pile[i] ));
  //  //  if (result) {
  //  //    break;
  //  //  }
  //  //}
  //  return result;
  //}


  Contextualize(parentArea: Rectangle, id: string) {
    let maxbp = 251000000;
    let scale = (parentArea.Width / maxbp);
    let first = this.offset1 * scale;
    let final = this.offset2 * scale;
    this._segmentContext = new SegmentRange(id, first, final);
  }

  AddAsContent(segment: DNASegment, context: ContextLayer, parentArea: Rectangle, top: number): boolean {
    if (!segment || top >= parentArea.Bottom) {
      return false;
    }

    if (!this._segmentContext) {
      this.Contextualize(parentArea, "segmentxxx");
    }
    //else {
    //  this._segmentContext
    //}
    this._segmentContext.AddContent(context, parentArea, top);
    this._pile.forEach(s => s.AddAsContent(segment, context, parentArea, top + 30));
    return true;
  }


  BuildPileByChromosome(overlaps: DNASegment[]): DNASegment[] {
    let r1 = [];
    this._piled = true;
    for (let i = 0; i < overlaps.length; i++) {
      let o = overlaps[i];
      if (!o.IsPiled && this.Overlap(o)) {
        o.BuildPileByChromosome(overlaps);
        r1.unshift(o);
      }
    }
    this._pile = this._pile.concat(r1);

    return overlaps;
  }

  BuildPile(segments: DNASegment[]) {
    return this.BuildPileByChromosome(segments);
  }

  BuildMatchBlocks() : string[] {
    let matchblock: string[] = [];
  //  this.
    return matchblock;
  }

  NoOverlaps(segment: DNASegment[]): DNASegment[] {
    return segment.filter(s => !this.Overlap(s));
  }

  AddToMatchPile(matchPile: CommonMatchPiles, memberId: string, pileId: string) {
    let self = this;

    let pmatch = matchPile.pileByMember.find(p => p.matchId == self.matchId);
    let p = { pile: pileId, size: self.Size };
    if (!pmatch) {
      pmatch = { matchId: self.MatchID, segments: [] };
      matchPile.pileByMember.push(pmatch);
    }
    let m3 = pmatch.segments.find(s2 => s2.memberID == memberId);
    if (!m3) {
      m3 = { memberID: memberId, piles: [] };
      pmatch.segments.push(m3);
    }
    m3.piles.push(p);
    this._pile.forEach(function (s, i) {
      s.AddToMatchPile(matchPile, memberId, pileId + ":" + i);
    });
  }
}

export class MatchStrength {
  matchId: string = "";
  total: number = 0;

}
//export class DNAPile {
//  private matchConnects: { id: string, index: string[] }[] = [];
//  private overlaps: any[] = [];
//  private largestCm: number = 0;
//  private largestSNP: number = 0;
//  constructor() {}

//  Overlap(segments: DNASegment[]) {
//    let segment = segments.shift();
//    if (segment) {
//      let overlaps = segment.Overlaps(segments);
//      overlaps.unshift(segment);
//      this.overlaps.push(overlaps);
//      this.Overlap(segment.NoOverlaps(segments));
//    }
//  }

//  BuildPile(segments: DNASegment[]) {
//    let self = this;
//    this.Overlap(segments.sort((a,b) => b.Size - a.Size));
//    this.overlaps = this.overlaps.sort((a, b) => a.length - b.length);
//    this.overlaps.forEach(function (l, i) {
//      let grp = ( i + 1 );
//      l.forEach(function (s, j) {
//        let newItem = self.matchConnects.find(ss => ss.id == (<DNASegment>s).MatchID);
//        if (!newItem) {
//          newItem = { id: (<DNASegment>s).MatchID, index: [] };
//          self.matchConnects.push(newItem);
//        }
//        let item = j + 1;
//        newItem.index.push(grp.toString() + ":" + item.toString());
//      });
//    });
//    this.matchConnects = this.matchConnects.sort((a, b) => b.index.length - a.index.length);
//  }

//AddSegment(segment: DNASegment) {
//  if (this.Chromosome != segment.Chromosome) { return; }
//  if (this.Offset1 > segment.Offset1) {
//    this.offset1 = segment.Offset1;
//  }
//  if (this.Offset2 < segment.Offset2) {
//    this.offset2 = segment.Offset2;
//  }
//  this.cm += segment.cM;
//  this.snp += segment.SNP;
//  if (this.largestCm < segment.cM) {
//    this.largestCm = segment.cM;
//  }
//  if (this.largestSNP < segment.SNP) {
//    this.largestSNP = segment.SNP;
//  }
//}
////}

export class Member implements IContextItem {
  //  dnaPile: DNAPile = new DNAPile();
  private _segmentMembers: string[] = [];
  constructor(
    private memberId: string,
    private name: string,
    private matchingSegments: DNASegment[] = []) {
    this.Sort();
    //while (this.matchingSegments.length> 0) ) {
    //  this.matchingSegments[i].BuildPile(this.matchingSegments);
    //}
  }

  CreateClusters(clusterId: number, matches: CommonMatch[] = []) : MatchCluster[] {
    let clusters: MatchCluster[] = [];
    this.matchingSegments.forEach(s => clusters.push(new MatchCluster(clusterId++, this.memberId, s, matches)));
    return clusters;
  }

  get Id() { return this.MemberID; }
  get zIndex() { return 0; }
  Draw(contextModel) { }
  CopyItem(newId: string): IContextItem {
    return null;
  }
  Save(): any {
    return '';
  }
  get MemberID(): string { return this.memberId; }
  get MatchingSegments(): DNASegment[] { return this.matchingSegments; }
  get Name(): string { return this.name; }
  get HasCommonMemberSegments() {
    return this._segmentMembers.length > 0;
  }
  get DisplayName(): string {
    return this.HasCommonMemberSegments ? "*" + this.name : this.name;
  }
  Sort() {
    let results: DNASegment[] = [];
    let segments = this.matchingSegments;
    segments = segments.sort((a, b) => a.Chromosome - b.Chromosome);
    for (let i = 1; i <= 23; i++) {
      let csegments = segments.filter(s => s.Chromosome == i);
      csegments = csegments.sort((a, b) => b.Size - a.Size);
      while (csegments.length > 0) {
        let e = csegments.shift();
        csegments = e.BuildPile(csegments).filter(s => !s.IsPiled);
        results.push(e);
      }
    }

    this.matchingSegments = results;
  }

  get TotalSize(): number {
    let total: number = 0;

    this.matchingSegments.forEach(s => total += s.Size);
    return total;
  }

  get LargestSize(): number {
    let size = 0;
    this.matchingSegments.forEach(function (s, i) {
      if (s.Size > size) {
        size = s.Size;
      }
    });

    return size;
  }

  CommonMemberSegment(otherMember: string): DNASegment[] {
    return this.matchingSegments.filter(s => s.CommonMemberSegments(otherMember));
  }

  CommonMemberSegments(otherMembers: string[]) {
    let self = this;
    otherMembers.forEach(function (m, i) {
      let memberSegments = self.matchingSegments.filter(s => s.CommonMemberSegments(m));
      if (memberSegments.length > 0) {
        self._segmentMembers.push(m);
      }
    });
  }


  CommonSurnames(surnames: Surname[]) {
    this.matchingSegments.forEach(s => s.CommonSurnames(surnames));
  }

  AddToMatchPile(matchPile: CommonMatchPiles) {
    let self = this;
    this.matchingSegments.forEach(function (s, i) {
      let pid = i.toString();
      if (i < 10) {
        pid = "0" + pid;
      }
      s.AddToMatchPile(matchPile, self.memberId, pid);
    });
  }

  AddAsContent(memberID: string, context: ContextLayer, parentArea: Rectangle) {
    context.PortPath.Clear();
    for (let i = 0; i < this.matchingSegments.length; i = i + 1) {
      let s = this.matchingSegments[i];
      let segment = s.GetCommonMemberSegment(memberID);
      if (s.AddAsContent(segment, context, parentArea, 100)) {
        break;
      }
    }
  }
}

export class Surname {

  constructor(private name: string,
    private matches: string[] = []) {

  }

  get Name(): string { return this.name; }
  get Matches(): string[] { return this.matches; }

  //public AddMatch(match: string, clear: boolean = false) {
  //  if (clear) {
  //    this.matches = [];
  //  }
  //  this.matches.push({ name: match, pile: [] });
  //  this.matches.forEach(m => m.pile.push(0));
  //}

}

export class MatchCluster {

  _id: number = -1;
  _primaryMatches: string[] = [];
  _secondaryMarches: string[] = [];
  private memberID: string;
  private chromosome: number = 0;
  private offset1: number = -1;
  private offset2: number = -1;
  private totalcM: number = 0;
  private largestcM: number = 0;

  constructor(id: number, memberId: string, dna: DNASegment, matches: CommonMatch[] = [])
  {
    this._id = id;

    this.chromosome = dna.Chromosome;
    dna.CreateCluster(memberId, this,matches);
    this._primaryMatches.sort((a, b) => a > b ? 1 : - 1);
  }
  
  get MemberID(): string { return this.memberID; }
  get Chromosome(): number { return this.chromosome; }
  get Offset1(): number { return this.offset1; }
  get Offset2(): number { return this.offset2; }
  get TotalcM(): number { return this.totalcM; }
  get LargestcM(): number { return this.largestcM; }

  AddPrimaryMatch(memberId: string, dna: DNASegment, matches: CommonMatch[] = [] ) {
    this.memberID = memberId;
    this._primaryMatches.push(dna.MatchID);
    matches.forEach(m => !m.AddToCluster(dna.MatchID,this._id));
    if (dna.Offset1 < this.offset1 || this.offset1 < 0) { this.offset1 = dna.Offset1; }
    if (dna.Offset2 > this.offset2) { this.offset2 = dna.Offset2; }
    this.totalcM += dna.cM;
    if (this.largestcM < dna.cM) { this.largestcM = dna.cM; }
  }
}

export class ClusterLink{
  matchId: string = '';
  clusters: number[] = [];

  AddCluster(matchId: string, id: number): boolean{
    if (this.matchId != matchId) { return false; }
    this.clusters.push(id);
    return true;
  }
}

export class Match {

  _clusterMates: string[] = [];
  constructor(private matchId: string,
    private surnames: string) { }

  get MatchID(): string { return this.matchId; }
  get Surnames(): string { return this.surnames; }

}
export class CommonMatch extends Match {
  private overlapingMatchs: ItemCount[] = [];
  public clusters: number[] = [];
  private totalcM: number = 0;

  constructor(matchId: string,
    surnames: string,
    matchDate: string[] = [],
    memberMatch: boolean = false,
    private matchingMembers: string[] = []) {
    super(matchId, surnames);
    this.Sort();
  }

  public ClusterCount() { return this.clusters.length; }
  AddToCluster(matchId: string,clusterId: number) {
    if (matchId == this.MatchID) {
      this.clusters.push(clusterId);
      return true;
    }
    return false;
  }

  AddcM(cM: number) {
    this.totalcM += cM;
  }

  get OverlapCount(): number {
    return this.overlapingMatchs.length;
  }

  AddOverLappingMatch(matchId: string) {
    //   this.overlapingMatchs.push(matchId);
  }
  Sort() {
    //  this.matchingMembers = this.matchingMembers.sort((a, b) => b.LargestSize - a.LargestSize);
  }
  OverlapMatchSort() {
    let r = this.overlapingMatchs.find(m => m.Count > 10);
    if (r) {
      let sss = 0;
    }
    this.overlapingMatchs = this.overlapingMatchs.sort((a, b) => a.Count - b.Count);
  }


  ReduceOverlaps(overlapingMatchs: string[]) {
    if (overlapingMatchs.length > 1) {
      var mid = overlapingMatchs[0];
      let i = overlapingMatchs.findIndex(m => m != mid);
      if (i > 4) {
        let sss = 0;
      }
      if (i > 10) {
        let sss = 0;
      }
      this.overlapingMatchs.push(new ItemCount(mid, i));
      this.ReduceOverlaps(overlapingMatchs.slice(i));
    }
  }

  get MatchingMembers(): string[] {
    return this.matchingMembers;
  }

  get TotalSize(): number {
    let total = 0;

    //  this.matchingMembers.forEach(m => total += m.TotalSize);

    return total;
  }

  get LargestSize() {
    if (this.matchingMembers.length <= 0) { return 0; }
    return 0; //this.matchingMembers[0].LargestSize;
  }
}

export class OverlapMatch extends Match {
  constructor(matchId: string,
    surnames: string,
    private segments: DNASegment[] = []) {
    super(matchId, surnames);
    this.Sort();
  }

  get Segments(): DNASegment[] {
    return this.segments;
  }

  get TotalSize(): number {
    let total = 0;

    this.segments.forEach(m => total += m.Size);

    return total;
  }

  Sort() {
    this.segments.sort((a, b) => b.Size - a.Size);

  }

  get LargestSize(): number {
    //if (this.segments.length <= 0 ) { return s1;}
    //let s2 = this.segments[0].Size;
    //if (s2 > s1) { return s2; }
    return 0;
  }

  //OverlapsWith(segments: DNASegment[]) {
  //  let self = this;
  //  let result: DNASegment[] = [];
  //  this.segments.forEach(function (s, i) {
  //    let overlaps = s.Overlaps(segments);
  //    overlaps.forEach(o => result.push(o));
  //  }); 
  //  return result;
  //}
}

export class MemberOverlaps {
  constructor(private memberId: string,
    private matches: OverlapMatch[] = [],
    private memberMatchCount: ItemCount[] = []) { }

  get MemberID(): string { return this.memberId; }
  get Matches(): OverlapMatch[] { return this.matches; }
  get MemberMatchCount(): ItemCount[] { return this.memberMatchCount; }

  Sort() {
    this.matches.forEach(m => m.Sort());
    this.matches.sort((a, b) => b.LargestSize - a.LargestSize);
  }
}

export class CommonMatches {
  matchPile: CommonMatchPiles = new CommonMatchPiles();
  constructor(
    private members: Member[] = [],
    private matches: CommonMatch[] = [],
    private overlaps: MemberOverlaps[] = [],
    private surnames: Surname[] = []) { }

  get Members() { return this.members; }
  get Matches() { return this.matches; }
  get Overlaps() { return this.overlaps; }
  get Surnames() { return this.surnames; }


  CommonSurnames() {
    let self = this;
    let names = this.members.map(m => m.Name);
    this.members.forEach(function (m, i) {
      m.CommonMemberSegments(names.filter(n => n != m.Name));
    });
    //  this.members.forEach(m => m.CommonSurnames(this.surnames));
  }

  Sort() {
    this.matches.forEach(m => m.Sort());
    //  this.overlaps.forEach(o => o.Sort());

    this.matches = this.matches.sort((a, b) => b.LargestSize - a.LargestSize);
    //    this.overlaps.sort((a,b) => a.)
  }

  SortMatchesByOverlap() {
    this.matches = this.Matches.sort((a, b) => a.OverlapCount - b.OverlapCount);
  }

  FindCommonSurnames() {
    // this.members.forEach( m => m.u)
  }

  BuildMatchPiles() {
    let self = this;
    this.members.forEach(m => m.AddToMatchPile(this.matchPile));
    this.matchPile.pileByMember = this.matchPile.pileByMember
      .filter(p => p.segments.length > 1)
      .sort((a, b) => b.segments.length - a.segments.length);
    let piles: string[] = [];
    this.matchPile.pileByMember.forEach(function (p, i) {
      let surnames = self.surnames.filter(n => n.Matches.findIndex(m => m == p.matchId) >= 0);
      if (surnames.length > 0) {
        let sss = 0;
      }
      let sn = "";
      surnames.forEach(n => sn += n.Name + ",  ");
      if (sn.length > 0) {
        let sss = 0;
      }
      if (sn.length > 0) {
        p.segments.forEach(function (s, j) {
          s.piles.forEach(function (pp, k) {
            piles.push(s.memberID + ":" + pp.pile + ":" + p.matchId + ":" + sn);
          });
        });
      }
    });
    piles = piles.sort((a, b) => a < b ? -1 : 1);
  }

}


export class DNAChromosomes extends EventContextLayer {

  private _lookupData: string = '';
  private matches: CommonMatches;
  constructor(
    parentArea: Rectangle) {
    super(
      parentArea,
      'dnaSegments'
      , 'dnaSegments'
      , 'sss1010'
      , new Date()
      , '');

    this.AddContent(new Rectangle('segmets_000', 0, 0, this.ParentArea.Width, this.ParentArea.Height, 'dnaSegments'))
    this.AddLine("segmentPath", "dnaSegmentLineColor", lineTypes.straight);
    //  this.ClearContent(1);
    this.ClearPaths();
    this.Init();
    //let pathId = 'familyTreePath_' + this.id + "_" + generation.toString();
    //let port1 = new Ellipse(pathId + "_A", personArea.Center.Y, personArea.Right - 0.5, 1, 1, 'personPort');
    //let p1 = new Port("familyTreePath_A_" + this.id, 0, 0, port1, ePortType.source, 'personPort', pathId, 0);
    //let port2 = new Ellipse(pathId + "_B", personArea.Center.Y, personArea.Right + 20.0, 1, 1, 'personPort');
    //let p2 = new Port("familyTreePath_B_" + this.id, 0, 0, port2, ePortType.target, 'personPort', pathId, 1);
    //let ports = [];
    //ports.push(port1.Center);
    //ports.push(port2.Center);
    //parent.AddPath(pathId, 'familyPath', ports);

    //parentArea.AddPort(p1);
    //parentArea.AddPort(p2);

  }
  Init() {
    this.ClearContent(1);
    this.ClearPaths();
    this.AddLine("dnasegmentpath", "timeLineColor", lineTypes.straight);
    this.AddLine("dnasegmentpathconnection", "timeLineColor", lineTypes.straight);
    this.AddContent(new Rectangle('familyTree', 0, 0, this.ParentArea.Width, this.ParentArea.Height / 2, 'familyTree'));

    // this.familyData.AddContent('familydata', this, this.Content[0] as Rectangle, 80, 0);
  }

  Open() {
    let reader = new FileReader();
  }

  LoadCanvasData(inputData: any): Promise<CommonMatches> {
    return this.OpenDNASegments(inputData);
  }

  UpdateCanvasData(inputData: any) {
    this.MemberLookUp(inputData);

  }

  GetContextData(): any {
    return this.matches;
  }

  Resize(parentArea: Rectangle) {
    super.Resize(parentArea);
    this.ClearContent(0, false);
    this.AddContent(new Rectangle('segmets_000', 0, 0, this.ParentArea.Width, this.ParentArea.Height, 'dnaSegments'))
    this.AddLine("segmentPath", "dnaSegmentLineColor", lineTypes.straight);
    this.MemberLookUp(this._lookupData);
  }

  AutoUpdate(): boolean {

    //if (this._actionItem.mouseState.State == 1 &&
    //  this._tracker.TrackedArea &&
    //  this._tracker.TrackedArea.Id == 'timelineSpan_timeline_year') {
    //  let direction = 0;
    //  if (this._tracker.TrackedArea.Left < this.ParentArea.Left) {
    //    let d = this.ParentArea.Left - this._tracker.TrackedArea.Left;
    //    direction = Math.floor((d / this.ParentArea.Width) * 10) + 1;
    //  }
    //  if (this._tracker.TrackedArea.Right > this.ParentArea.Right) {
    //    let d = this._tracker.TrackedArea.Right - this.ParentArea.Right;
    //    direction = -Math.floor((d / this.ParentArea.Width) * 10) - 1;
    //  }
    //  if (direction) {
    //    let timeLine = this.ContentFromID('timeline_year') as TimeLine;
    //    timeLine.Contents.forEach((s, i) => s.Shape.MoveBy(direction, 0));
    //    timeLine.ShiftContent(new Point(0, 0), this.ParentArea.Right);
    //    return true;
    //  }
    //}
    return false;
  }

  //document.getElementById('readBtn').addEventListener('click', () => {
  //  let file = document.getElementById('fileInput');
  //  processFile(file.files[0]);
  //})
  //}


  LoadReader(reader: FileReader): Promise<CommonMatches> {
    let self = this;
    //  let matchPiles: CommonMatchPiles = new CommonMatchPiles();
    //  let mm = { memberID: member.MemberID, piles: [] };

    const promise = new Promise<CommonMatches>((resolve, reject) => {
      reader.onload = () => {
        let ccc: number[] = [];
        let data = reader.result;
        let commonMatches: CommonMatch[] = [];
        let memberOverlaps: MemberOverlaps[] = [];
        let surnames: Surname[] = [];
        let members: Member[] = [];
        let matches = JSON.parse(data.toString());
        matches.Members.forEach(function (m, i) {
          let segments: DNASegment[] = [];
          m.MatchingSegments.forEach(function (y, k) {
            segments.push(new DNASegment(y.Chromosome, y.Offset1, y.Offset2, y.cM, y.SNP, y.matchId));
          });
          //let sz: { chromosome: number, size: number }[] = [];
          //let mm = { memberID: m.MemberID, piles: [] };
          //segments.forEach(function (s, i) {
          //  sz.push({ chromosome: s.Chromosome, size: s.PileSize() });
          //  let p = { pile: i, size: s.Size };
          //  let pmatch = matchPiles.pileByMember.find(p => p.matchId == s.MatchID);
          //  if (!pmatch) {

          //    mm.piles.push(p);
          //    let m2 = { matchId: s.MatchID, segments: [] }
          //    m2.segments.push(m2);
          //    matchPiles.pileByMember.push(m2);
          //  }
          //  else {
          //    let m3 = pmatch.segments.find(s2 => s2.memberID == s.MatchID);
          //    if (!m3) {

          //      pmatch.segments.push(mm);
          //    }
          //    else {
          //      m3.piles.push(p);
          //    }
          //  }
          //});
          members.push(new Member(m.MemberID, m.Name, segments));
        });
        matches.Matches.forEach(function (m, i) {
          let members: string[] = [];
          let dates: string[] = [];

          m.MatchingMembers.forEach(function (x, j) {
            //let overlaps: OverlapMatch[] = [];
            //x.OverlapSegments.forEach(function (y, k) {
            //  let osegments: DNASegment[] = [];
            //  y.Segments.forEach(function (z, l) {
            //    osegments.push(new DNASegment(z.Chromosome, z.Offset1, z.Offset2, z.cM, z.SNP));
            //  });
            //  overlaps.push(new OverlapMatch(y.MatchId, y.surNames, osegments));
            //});
            members.push(x);

          });
          var cm = new CommonMatch(m.MatchID, m.surNames, m.MatchDate, m.MemberMatch, members);

          commonMatches.push(cm);
        });
        matches.Overlaps.forEach(function (o, i) {
          let omatches: OverlapMatch[] = [];
          let icount: ItemCount[] = [];
          o.Matches.forEach(function (x, j) {
            //  if( x.matchId == "Robert Carl Reeder")
            let osegments: DNASegment[] = [];
            x.Overlap.forEach(function (y, k) {
              //    osegments.push(new DNASegment(y.Chromosome, y.Offset1, y.Offset2, y.cM, y.SNP));
            });
            omatches.push(new OverlapMatch(x.MatchID, x.surNames, osegments));

          });
          o.MemberMatchCount.forEach(function (z, a) {
            icount.push(new ItemCount(z.ItemName, z.Count));
          });
          memberOverlaps.push(new MemberOverlaps(o.MemberId, omatches, icount));
        });
        matches.Surnames.forEach(function (s, i) {
          surnames.push(new Surname(s.Name, s.Matches));
        });
        self.matches = new CommonMatches(members, commonMatches, memberOverlaps, surnames);
        self.matches.CommonSurnames();
        let clusters: MatchCluster[] = [];
        let id = 0;
        let len = members.length;
        let common = self.matches.Matches.filter(m => m.MatchingMembers.length > 1);
        members.forEach(function (m, i) {
          clusters = clusters.concat(m.CreateClusters(id, self.matches.Matches));
        //  clusters.
          // search each cluster for common matches
          id = clusters.length + 1;
        });

        let xx1 = self.matches.Matches.filter(m => m.ClusterCount() > 1);
        clusters = clusters.sort((a, b) => a.TotalcM > b.TotalcM ? 1 : -1);
        clusters.forEach(function (c, j) {
 
          xx1.forEach(function (x, i) {
            
            if (x.clusters.findIndex((y) => y == c._id) >= 0) {
              ccc = ccc.concat(x.clusters);
              ccc.push(c._id * 100)
            }
          }); 
      //    x.clusters
        });
        //let sss5 = members.find(x => x.MemberID == '197182');
        //let sss6 = sss5.MatchingSegments.filter(x => x.MatchID.includes('Robert'));
        //let sss7 = sss6.filter(x => x.MatchID.includes('Smith'));
        //let sss8 = xxx1.find(x => x.MatchID == 'Robert  Smith')
        //self.matches.BuildMatchPiles();
        resolve(self.matches);

      };
    });
    return promise;
  }

  asyncFun() {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Console from promise function");
        resolve("complete");
      }, 3000);
    });
    return promise;
  }


  OpenDNASegments(event): Promise<CommonMatches> {
    let matches: CommonMatches;
    let files = event.target.files;
    let reader = new FileReader();
    let unknownMember: Member = new Member("?", "", []);
    reader.readAsText(files[0]);
    return (this.LoadReader(reader));

    //.then(function (success) {
    //  // This is success handler
    //  console.log(success);
    //})
    //  .catch(function (error) {
    //    // This is error handler
    //    console.error(error);
    //  });
    //   this.LoadReader(reader);
  }

  BuildOverLapTree() {
    let t = this;
    //this.matches.Overlaps.forEach(function (m1, i) {
    //  let memberMatches = t.matches.Matches.filter(m2 => m2.MatchingMembers.findIndex(m3 => m3.MemberID == m1.MemberID) >= 0);
    //  let len = memberMatches.length;
    //  let overlapMatches: string[] = [];
    //  for (let k = 0; k < len - 1; k++) {
    //    overlapMatches = [];
    //    let member1 = memberMatches[k].MatchingMembers.find(mk => mk.MemberID == m1.MemberID);
    //    for (let x = k + 1; x < len; x++) {
    //      let member2 = memberMatches[x].MatchingMembers.find(mx => mx.MemberID == m1.MemberID);
    //      member1.MatchingSegments.forEach(function (s1, kk) {
    //        let overlaps = s1.Overlaps(member2.MatchingSegments);
    //        if (overlaps.length > 0) {
    //          overlapMatches.push(memberMatches[x].MatchID);
    //        }
    //        else {
    //          let xxx = 0;
    //        }
    //      });
    //    }
    //    overlapMatches = overlapMatches.sort();
    //    memberMatches[k].ReduceOverlaps(overlapMatches);
    //    memberMatches[k].OverlapMatchSort();
    //  }

    // });
  }
  CheckOverlaps(matchingMemberId: string, match: CommonMatch) {
    var member = this.matches.Overlaps.filter(o => o.MemberID == matchingMemberId);

    //  member[0].Matches[0].Segments[0].OverLaps();
  }

  FindLargestSegmntForEach(member1: string, member2: string) {
    //let localmatches = this.matches.Matches.filter(m => m.MatchingMembers.findIndex(mm => mm.MemberID == member1) >= 0);
    //localmatches = localmatches.filter(m => m.MatchingMembers.findIndex(mm => mm.MemberID == member2) >= 0);
    //localmatches.forEach(function (m, i) {
    //  m.MatchingMembers.forEach(function (mm, j) {
    //    mm.MatchingSegments.sort((a, b) => b.Size - a.Size);
    //  });
    //});
  }


  ExploreCommonMatches(memberID: string[]) {
    /// find over lap between two members
    //let matches = this.matches.Matches.filter(m => m.MatchingMembers.findIndex(mm => mm.MemberID == memberID[0]) >= 0);
    //matches = matches.filter(m => m.MatchingMembers.findIndex(mm => mm.MemberID == memberID[1]) >= 0);
    //matches.forEach(function (m, i) {

    //});
  }
  ExploreMemberMatches(memberID: string) {
    //let matches = this.matches.Matches.filter(m => m.MatchingMembers.length > 2 && m.MatchingMembers.findIndex(mm => mm.MemberID == memberID) >= 0);
    //let surnameMatches = matches.filter(m => m.Surnames.length > 0);
    // who shares the most matches?
    // who shares the most DNA?
    // do any surnames match?
    // 

    //matches.forEach(function (m, i) {
    //  if( m.Surnames.length > 0 )
    // // let member = m.MatchingMembers.find(mm => mm.MemberID == memberID);
    // // questions:
    //  // are there any segments that overlap from each match.
    //  // compare all the segments from each match for overlap.
    //  // get all segments of other members that overlap
    //});

  }
  // Sort

  MemberLookUp(lookupData: string) {
    // this.BuildOverLapTree();
    this.matches.SortMatchesByOverlap();
    let self = this;
    let dnaMaps: DNAMap[] = [];
    this._lookupData = lookupData;
    let surnames: string[] = [];
    let memberIds = lookupData.split(',');
    this.ExploreCommonMatches(memberIds);
    var memberMatches = this.matches.Matches.filter(m => m.MatchingMembers.length > 1);
    //memberIds.forEach(function (m, i) {
    //  memberMatches = memberMatches.filter(mm => mm.MatchingMembers.findIndex(mmm => mmm.MemberID == m) >= 0);
    //});
    memberIds.forEach(function (mid, i) {
      let dna: DNAMap = new DNAMap(mid);
      //  var matches = memberMatches.filter(mm => mm.MatchingMembers.findIndex(mmm => mmm.MemberID == mid) >= 0);

      //matches.forEach(function (m, j) {
      //  var member = m.MatchingMembers.find(x => x.MemberID == mid);
      //  if (member != null) {
      //    //    var results = this.Surnames.filter(s => s.Matches.FindIndex(mmm => mmm == m.MatchID) >= 0);
      //    //    results.for
      //    //{
      //    //  //         surnames.Add($"{n.Name}-{n.m}");
      //    //}
      //    dna.AddSegments(m.MatchID, member.MatchingSegments);
      //  }
      //});


      dna.Order();
      //  surnames = surnames.OrderBy(s => s).ToList();
      dnaMaps.push(dna);
    });


    dnaMaps[0].AddContent(this, this.Content[0] as Rectangle);

    var omember = this.matches.Overlaps.find(o => o.MemberID == '610185');
    var omatches = omember.Matches.filter(m => m.Segments.findIndex(s => s.Chromosome == 5) >= 0);

    //     dna.RemoveMatch("Joan  McGregor");
    var sss = 0;

    //let dnaMaps: DNAMap[] = [];
    //let surnames: string[] = [];
    //let lookups = selectedMatch.split(',');
    //let mmatches = this.matches.Matches;
    //lookups.forEach(function (m, i) {
    //  mmatches = mmatches.filter(mm => mm.MatchingMembers.findIndex(mmm => mmm.MemberID == m) >= 0);
    //});

    //lookups.forEach(function (m, i) {
    //  let dna: DNAMap = new DNAMap(m);
    //  let matches = mmatches.filter(mm => mm.MatchingMembers.findIndex(mmm => mmm.MemberID == m) >= 0);
    //  matches.forEach(function (x, j) {
    //    let member = x.MatchingMembers.find(y => y.MemberID == m) || this.unknownMember;
    //    dna.AddSegments(x.MatchID, member.MatchingSegments);
    //  });
    //});

  }

  ProcessResult() {
    let sss = 0;
    let self = this;
    //  let match = this.matches.Matches.find(m => m.MatchID == this.selectedMatch);
    let overlaps: OverlapMatch[] = [];
    this.matches.Matches.forEach(function (match, j) {
      match.MatchingMembers.forEach(function (m, i) {
        //let laps = self.matches.Overlaps.find(o => o.MemberID == m.MemberID);
        //if (laps.Matches.length > 0) {
        //  var sss = 0;
        //}
        //var result = laps.Matches.filter(x => x.MatchID == match.MatchID);
        //if (result.length > 0) {
        //  let sss = 0;
        //}
        //result.forEach(r => overlaps.push(r));
      });

      // laps.Matches.forEach(function (x, j) {

      //let result = x.OverlapsWith(m.MatchingSegments);
      //if (result.length > 0) {
      //  result.forEach(r => overlaps.push(r));
      //}
      // });
    });
    //    let overlaps = this.matches.Overlaps.find(o => o.Matches.findIndex(m => m.MatchID == this.selectedMatch) >= 0);
    this.matches.Sort();
    this.matches.Overlaps.forEach(o => this.FindFirstMatch(o))

    // Find first two occurances for each member



    // let xxx = this.matches.Matches[100] as CommonMatch;
    // let sss = xxx.LargestSize;
    //  xxx.Sort();
    //   this._matchList = [];

    // this.matches.Matches.sort(m => m.MatchingMembers)
    //  let p = "/CommonMatches/Matches/Match";
    //  let x1 = this._xmlDoc.getElementsByTagName("CommonMatches");
    //  let x2 = x1[0].getElementsByTagName("Matches");
    //   let x = x2[1].getElementsByTagName("Match");
    //   let txt = '';
    //for (let i = 0; i < x.length; i++) {
    //  let node = x[i].childNodes[1];
    //  if (node) {
    //    this._matchList.push(x[i].childNodes[1].textContent);
    //  }
    //}
  }

  FindFirstMatch(moverlaps: MemberOverlaps) {
    let self = this;
    //this.matches.Matches.forEach(function (m, i) {
    //  let index = m.MatchingMembers.findIndex(mm => mm.MemberID == moverlaps.MemberID);
    //  self.matches.Surnames.forEach(function (n) {
    //    if (n.Matches.findIndex(ms => ms == m.MatchID) >= 0) {
    //      let xyz = 0;
    //    }
    //  });
    //  if (index >= 0) {// if this member is in match group,  process the members for each match
    //    m.MatchingMembers.forEach(function (a, k) { // get the overlaps for each member
    //      let member = self.matches.Overlaps.find(o => o.MemberID == a.MemberID);
    //      member.Matches.forEach(function (x, j) {
    //        a.MatchingSegments.forEach(function (s1, n) {
    //          let overlaps = s1.Overlaps(x.Segments);
    //          if (overlaps.length > 0) {
    //            let sss = 0;
    //            self.matches.Surnames.forEach(function (n) {
    //              if (n.Matches.findIndex(ms => ms == x.MatchID) >= 0) {
    //                let xyz = 0;
    //              }
    //            });
    //          }
    //        });
    //      });
    //    });
    //  }
    //});
  }
}
