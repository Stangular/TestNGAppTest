import {
  Component,
  OnInit,
  AfterViewInit,
  HostListener
} from '@angular/core';
import * as ol from 'ol';
// D3: https://openlayers.org/en/latest/examples/d3.html
// http://bl.ocks.org/mbertrand/5218300
// https://bl.ocks.org/d3indepth/64be9fc39a92ef074034e9a8fb29dcce
// https://stackoverflow.com/questions/31563351/d3-js-svg-on-openlayers3-interactive-map
// https://jsfiddle.net/grabantot/3gq5wbqz/

import Map from 'ol/map.js';
import OSM from 'ol/source/OSM.js';
import XYZ from 'ol/source/xyz.js';
import TileImage from 'ol/source/tileimage.js';
import Attribution from 'ol/control/Attribution';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON';
import TileLayer from 'ol/layer/tile.js';
import Tile from 'ol/layer/tile.js';
import View from 'ol/view.js';
import Style from 'ol/style/Style.js';
import Projection from 'ol/proj/Projection.js';
import Icon from 'ol/style/Icon.js';
import Text from 'ol/style/Text.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import Feature from 'ol/Feature.js';
import * as geom from 'ol/geom';
import * as proj from 'ol/proj';

//@Component({
//  selector: 'ol-map',
//  templateUrl: './USHistoricData.component.html',
//  styleUrls: ['./USHistoricData.component.css']
//})

//export class USHistoryDataComponent implements OnInit {


//  constructor() {
//  }

//  ngOnInit() {

//  }
//  //onMoveEnd(event: any) {
//  //  var zoom = this._map.getView().getZoom();
//  //  var sss = 0;
//  //}

//  ngAfterViewInit() {

    
//  }
//}

    //new Tile({
    //  source: new XYZ({
    //    attributions: [attribution],
    //    url: 'http://geo.nls.uk/maps/towns/glasgow1857/{z}/{x}/{-y}.png'
    //  })
    //}),
