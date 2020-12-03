import { Component, OnInit } from '@angular/core';
import { TreeviewService } from '../service/treeview.service';

@Component({
  selector: 'treeviewlist',
  templateUrl: './treeviewlist.component.html',
  styleUrls: ['./treeviewlist.component.css']
})
export class TreeviewlistComponent implements OnInit {

  constructor(private _treeviewService: TreeviewService) { }

  ngOnInit() {}

}
