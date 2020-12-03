import { Component, OnInit } from '@angular/core';
import { PlaceService } from '../../services/place/place.service';

@Component({
  selector: 'app-placetree',
  templateUrl: './placetree.component.html',
  styleUrls: ['./placetree.component.css']
})
export class PlaceTreeComponent implements OnInit {

  constructor(private _placeService: PlaceService) { }

  ngOnInit() {}
  placeModel() {

  }
}
