import { Component, Input, OnInit } from '@angular/core';
import { TreeviewlistComponent } from '../treeviewlist/treeviewlist.component';
import { ITreeNode } from 'src/models/Interface/IIndexer';
@Component({
  selector: 'treeviewnode',
  templateUrl: './treeviewnode.component.html',
  styleUrls: ['./treeviewnode.component.css']
})
export class TreeviewnodeComponent implements OnInit {

  @Input() node: ITreeNode;

  constructor() { }

  ngOnInit() {
  }

}
