import { Component, OnInit } from '@angular/core';
import { TreeviewService } from '../service/treeview.service';
@Component({
  selector: 'treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.css']
})
export class TreeviewComponent implements OnInit {

  constructor(private _treeviewService: TreeviewService) { }

  ngOnInit() {}

}
