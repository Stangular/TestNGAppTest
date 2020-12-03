import { Component, OnInit } from '@angular/core';
import { PlaceService } from 'src/services/place/place.service';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css']
})
export class SandboxComponent implements OnInit {

  constructor(public _placeService: PlaceService) { }

  ngOnInit() {
  }

}
