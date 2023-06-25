import { Component, ViewChild } from '@angular/core';
import { FilterService } from 'src/NAS_App/Services/filter/filter.service';
import { UserService } from 'src/app/user/service/app-user.service';
import { NavigationService } from 'src/models/navigation/navigationService';
import { NavigationLink } from 'src/models/navigation/navigationLink';
import { DataHTTPService } from 'src/dataManagement/service/dataHTTP.service';
import { extend } from 'webdriver-js-extender';
import { CanvasService } from 'src/canvas/service/canvas.service';
import { IContextItem, ContextLayer } from 'src/canvas/models/IContextItem';
import { Ellipse } from 'src/canvas/models/shapes/ellipse';
import { Port } from 'src/canvas/models/shapes/port';
import { Rectangle } from 'src/canvas/models/shapes/rectangle';
import { ActionCanvasComponent } from 'src/canvas/component/layers/Action/actionCanvas.component';
import { CommonMatches, DNASegment, Surname, CommonMatchPiles, Match, CommonMatch, Member } from 'src/canvas/models/concepts/CommonMatchDNA/dnaChromosome';
import { forEach } from '@angular/router/src/utils/collection';

@Component({

  selector: 'dna-segments',
  templateUrl: './DNASegments.component.html',
  styleUrls: ['./DNASegments.component.css']
})
export class DNASegmentsComponent {
  @ViewChild("dnaSegmentCanvas") dnaSegmentCanvas: ActionCanvasComponent;
  members: { name: string, checked: boolean }[] = [];
  canvas_size = 29;
  selectedMatch: string = "***";
  rowdata: number[] = [1, 2, 3, 4, 6, 7, 8];
  _xmlDoc: any;
  _matchList: string[] = [];
  matches: CommonMatches;

  constructor(private filterService: FilterService
    , public canvasService: CanvasService
    , public userService: UserService
    , public httpService: DataHTTPService
    , private navService: NavigationService) {

    //   1)Select Match/paint chromosome
    //  2)Get overlap matches

    //    
    //this.navService.AddTo(new NavigationLink('People', '', '/people'), 'Lost Cause');
    //this.navService.AddTo(new NavigationLink('States', '', '/states'), 'Lost Cause');
    //this.navService.AddTo(new NavigationLink('Person', 'view_compact', '/people/detail', 'lc_people'), 'People');
    //this.navService.AddTo(new NavigationLink('All', 'grid_on', '/people/table', 'lc_people'), 'People');
    //this.navService.AddTo(new NavigationLink('State Detail', 'view_compact', '/states/detail', 'lc_states'), 'States');
    //this.navService.AddTo(new NavigationLink('State Table', 'grid_on', '/states/table', 'lc_states'), 'States');

  }

  MemberLookUp() {
    this.dnaSegmentCanvas.UpdateCanvas(this.selectedMatch);

  }

  get SelectedMembers() { return this.members.filter(m => m.checked); }

  FindCommonMatches() {

  }
  XXX3() {
    this.matches.Members.forEach(function (m, i) {
      // m.MatchingSegments[0].m
    });
  }
  XXX2() {
    let surnames: { id: string, name: Surname }[] = [];
    let self = this;
    let l = this.SelectedMembers.length;
    let overlaps1: DNASegment[] = [];
    let overlaps2: DNASegment[] = [];
    let overlaps3: DNASegment[] = [];

    for (let i = 0; i < l - 1; i++) {
      let r1 = self.SelectedMembers[i].name.split(':');

      let m1 = this.matches.Members.find(m => m.MemberID == r1[0].trim());
      for (let j = i + 1; j < l; j++) {
        let r2 = self.SelectedMembers[j].name.split(':');
        overlaps1 = [];
        overlaps2 = [];
        let m2 = this.matches.Members.find(m => m.MemberID == r2[0].trim());
        let segments = m2.MatchingSegments.filter(m => m.MatchID == m1.Name);
        segments.forEach(function (s, k) {
          overlaps1 = s.Overlaps(m2.MatchingSegments);
          if (overlaps1.length > 0) {
            let sss = 0;
          }
        });
        segments.forEach(function (s, k) {
          overlaps2 = s.Overlaps(m1.MatchingSegments);
          if (overlaps2.length > 0) {
            let sss = 0;
          }
        });
        overlaps1.forEach(function (o1, n) {
          let r = overlaps2.find(o2 => o2.MatchID == o1.MatchID);
          overlaps3.push(r);
        });
        overlaps3 = overlaps3.filter(o => o != undefined);
        overlaps3.forEach(function (o, m) {
          let r = self.matches.Surnames.filter(s => s.Matches.findIndex(mm => mm == o.MatchID) >= 0);
          r.forEach(rr => surnames.push({ id: o.MatchID, name: rr }));
        });
        surnames = surnames.sort((a, b) => a.name.Name < b.name.Name ? 1 : -1);
        //     overlaps3 = overlaps3.concat(r);
      }
    }
  }

  // member/match/
  //SegmentsByMemberMatch(memberId: string, matchId: string) {
  //  let segment = segments.find(s => s.MatchID == matchId);
  //  if (segment != null) {
  //    this.SegmentsByMemberMatch(memberId, matchId);
      
  //  }
  //}

  FindCommonXX1() {
    //   this.XXX2();
    //   return;
    let surnames: string[] = [];
    let self = this;
    let selected = this.SelectedMembers;
    // find all the matches the selected members have in common.
    // check for common surnames
    //
    let matches = this.matches.Matches.filter(m => m.MatchingMembers.length > 2);
    // let matchesa = this.matches.Matches.filter(m => m.MatchingMembers.length > 2);
    //  let matches = this.matches.Matches.filter(m => m.MatchingMembers.length > 1);
    let matchesb = this.matches.Matches.filter(m => m.MatchingMembers.length == 1);

    for (let i = 0; i < selected.length; i++) {
      let r1 = selected[i].name.split(':');
      let id = r1[0].trim();
      matches = matches.filter(m => m.MatchingMembers.findIndex(mm => mm == id) >= 0);
    }
    matches.forEach(function (m, i) {
      self.matches.Members[0].MatchingSegments[0].Pile
     // find the segments that overlap for each member with the common matches
    });
    // secondary matches...
    let surnameMatches = matches.filter(m => m.Surnames.length > 0);

    //  matches = matches.filter(m => m.Surnames.length <= 0);
    // get all the surnames for the matches with surnames
    // category 1: surnames with any of the matches
    // category 2: surnames with more than one of the matches
    // category 3: surnames with all of the matches;
    let sn = this.matches.Surnames;
    //  surnames = surnames.filter(s => s.Name == 'cary');
    for (let i = sn.length - 1; i >= 0; i--) {
      for (let j = 0; j < surnameMatches.length; j++) {
        let n = sn[i].Matches.findIndex(s => s == surnameMatches[j].MatchID);
        if (n >= 0) {
          surnames.push(sn[i].Name + " : " + surnameMatches[j].MatchID);
        }
      }
    }
    surnames.sort((a, b) => a < b ? 1 : -1);
    let sss = 0;
  }
  // start with member
  // find common matches with all members
  // map out all common segments for each match
  // assign surames to each segment.
  // try to identify 
  FindCommonSegments(id: string, segment: DNASegment) {
    let segments = [];
    let member = this.matches.Members.find(m => m.MemberID == id);
    if (member) {
      segments = segment.Overlaps(member.MatchingSegments);
    }
    segments = segments.sort((a, b) => a.matchId < b.matchId ? -1 : 1);

    return segments;
  }

  FindCommon() {
    let sssa = [], sssb = [];
    let self = this;
    let selected = this.SelectedMembers;
    let len = selected.length;
    if (len == 1) {
      let r1 = selected[0].name.split(':');
      let id1 = r1[0].trim();
      let name1 = r1[1].trim();
      // let
      let members = this.matches.Members.filter(m => m.MemberID != id1);
      members.forEach(function (m, i) {
        let segments = m.MatchingSegments.filter(s => s.MatchID == name1);
        segments.forEach(s => self.FindCommonSegments(m.MemberID, s));
      });
    }
    else {

      for (let i = 0; i < len - 1; i++) {
        let r1 = selected[i].name.split(':');
        let name1 = r1[1].trim();
        for (let j = i + 1; j < len; j++) {
          let r2 = selected[j].name.split(':');
          let id2 = r2[0].trim();
          let name2 = r2[1].trim();
          let member = this.matches.Members.find(m => m.MemberID == id2);
          let segments = member.MatchingSegments.filter(s => s.MatchID == name1);
          if (segments.length > 0) {
            // find the segments from member 1 that overlaps this segments;
            segments.forEach(s => sssa.push(self.FindCommonSegments(r1[0].trim(), s)));
            // find the segments from member 2 that overlaps this segment...
            segments.forEach(s => sssb.push(self.FindCommonSegments(member.MemberID, s)));
            // find the common matches?
          }
        }
      }
    }
  }

  setMemberSelection(member: any) {
    member.checked = !member.checked;

    this.AnalyzeSegmentsSSS();
    //  this.ProcessMember(member.name);
  }

  private AnalyzeSegments() {
    let self = this;
    let members = this.members.filter(m => m.checked);
    if (members.length > 1) {// if selected members have common segments load them...
      let member = this.matches.Members.find(m => members[0].name.indexOf(m.Name) >= 0);
      //    member.CommonMemberSegment(members[1].name);
      let nameID = members[1].name.split(':');
      this.dnaSegmentCanvas.Clear();
      member.AddAsContent(nameID[1].trim(), this.dnaSegmentCanvas.ContextLayer, this.dnaSegmentCanvas.ClientArea);
      this.dnaSegmentCanvas.Draw();
    }
  }

  private AnalyzeSegmentsSSS() {
    let self = this;
    let commonMatches: CommonMatch[] = this.matches.Matches;
    let segments: DNASegment[][] = [];
    let selectedMembers: Member[] = [];
    let members = this.members.filter(m => m.checked);
    let mids: string[] = [];

    members.forEach(function (m, i) {
      let x = m.name.split(':');
      commonMatches = commonMatches.filter(m => m.MatchingMembers.findIndex(mm => mm == x[0].trim()) >= 0);
      selectedMembers.push(self.matches.Members.find(m => m.Id == x[0].trim()));
    });

    if (members.length > 1) {// if selected members have common segments load them...

      let surnames: { surname: string, mid: string }[] = [];
      let nameIDA = members[0].name.split(':');
      let nameIDB = members[1].name.split(':');
      let commonMatches = this.matches.Matches.filter(m => m.MatchingMembers.findIndex(mm => mm == nameIDA[0].trim()) >= 0);
      commonMatches = commonMatches.filter(m => m.MatchingMembers.findIndex(mm => mm == nameIDB[0].trim()) >= 0);
      //commonMatches = commonMatches.filter(m => m.MatchID != "Kathy Shannon" && m.MatchID != "Joan McGregor");
      // Need to find how the resulting common matches pile between the selected members.
     
      commonMatches.forEach(function (m, i) {
        surnames = surnames.concat(self.matches.Surnames.filter(s => s.Matches.findIndex(mm => mm == m.MatchID) >= 0).map(s => { return { surname: s.Name, mid: m.MatchID } } ));
      });

      selectedMembers.forEach(function (mm, j) {
        segments[j] = [];
        commonMatches.forEach(function (m, i) {
          let mid = m.MatchID.trim().replace(/\s/g, "").toLowerCase();
          let seg = mm.CommonMemberSegment(mid);
          if (seg.length > 0 && seg[0].InGroup(segments[j]) < 0) {
            segments[j].push(seg[0]);
          }
        });
      });
      //let segA = memberA.CommonMemberSegment(mid);
      //let segB = memberB.CommonMemberSegment(mid);
      //if (segA.length > 0) {
      //  if (segA[0].InGroup(segmentsA) < 0) {
      //    segmentsA.push(segA[0]);
      //  }
      //}
      //if (segB.length > 0) {
      //  if (segB[0].InGroup(segmentsB) < 0) {
      //    segmentsB.push(segB[0]);
      //  }
      //}
      // });
      surnames = surnames.sort((a, b) => a.surname > b.surname ? 1 : -1);
      let sss = 0;
    }
  }

  private ProcessMember(memberName: string) {
    let member = this.matches.Members.find(m => memberName.indexOf(m.Name) >= 0);
    let sz: { chromosome: number, size: number }[] = [];
    let matchPiles: CommonMatchPiles = new CommonMatchPiles();

    //let mm = { memberID: member.MemberID, piles: [] };
    //member.MatchingSegments.forEach(function (s, i) {
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
    sz = sz.sort((a, b) => b.size - a.size);
    // find members matched with most...
    let mxxx: { mid: string, matches: string[] }[] = [];
    let nxxx: { name: string, count: number }[] = [];
    let mmembers = this.matches.Matches.filter(m => m.MatchingMembers.findIndex(mm => mm == member.MemberID) >= 0);
    this.matches.Members.filter(m => m.MemberID != member.MemberID).forEach(m => mxxx.push({ mid: m.MemberID, matches: [] }));
    mmembers.forEach(function (m, i) {
      m.MatchingMembers.forEach(function (mm, j) {
        let mbr = mxxx.find(mmm => mmm.mid == mm);
        if (mbr) {
          let matchid = m.MatchID + (m.Surnames.length > 0 ? '*' : '-');
          let rpn = nxxx.find(n => n.name == matchid);
          if (rpn) {
            rpn.count++;
          }
          else {
            nxxx.push({ name: matchid, count: 1 });
          }

          mbr.matches.push(matchid);
        }
      });
    });
    nxxx = nxxx.filter(n => n.count > 1).sort((a, b) => b.count - a.count);
    mxxx = mxxx.sort((a, b) => b.matches.length - a.matches.length);
    mxxx.forEach(m => m.matches = m.matches.sort((a, b) => a < b ? 1 : -1));
    let piles = this.matches.matchPile.pileByMember.filter(p => p.segments.findIndex(s => s.memberID == member.MemberID) > 0);

  }
  // how the DNA piles up and how the matches connect to them
  // which match has the most DNA in each pile
  // which surname or placename can be associated with each 
  OpenDNASegments(event) {
    let self = this;
    this.dnaSegmentCanvas.InitCanvas(event).then(function (result) {
      // This is success handler
      self.matches = <CommonMatches>result;
      let len = Math.ceil(self.matches.Members.length / 6);
      self.canvas_size -= len;

      self.matches.Members.forEach(m => self.members.push({ name: m.MemberID + " : " + m.DisplayName, checked: false }));
    }).catch(function (error) {
      // This is error handler
      console.error(error);
    });
    let adsfadsf = 0;
  }
}
