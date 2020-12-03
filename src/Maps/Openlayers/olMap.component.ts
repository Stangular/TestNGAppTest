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
// http://viglino.github.io/ol-ext/

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
import { DataHTTPService } from 'src/dataManagement/service/dataHTTP.service';
import { CanvasService } from 'src/canvas/service/canvas.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

export interface IListItem {
  SelectItemById(id: any): boolean;
  SelectItem(searchData: any): boolean;
}

export interface IIndexer {
  SelectItemById(id: any): boolean;
  SelectItem(searchData: any): boolean;
  ValidItem(): boolean;
  SelectedItem(): any;
  AddItem(item: any): boolean ;
  RemoveItem(index: any): boolean;
  First(): boolean;
  Last(): boolean;
  Next(): boolean;
  Previous(): boolean;
  Set(index: number): boolean;
}

export class Indexer implements IIndexer{
  private _index = -1;
  private _count: number = -1;
  constructor(protected _items: IListItem[] = []) {
    this._count = this._items.length;
    this.Last();
  }

  SelectItemById(id: any): boolean {
    this._index = this._items.findIndex(i => i.SelectItemById(id));
    return this.ValidItem();
 };

  SelectItem(searchData: any): boolean {
    this._index = this._items.findIndex(i => i.SelectItem(searchData));
    return this.ValidItem();
  }


  ValidItem() : boolean {
    return (this._index >= 0 && this._index < this._count);
  }

  SelectedItem(): IListItem {
    return (this.ValidItem) ? this._items[this._index] : null;
  }

  AddItem(item: IListItem): boolean {
    if (item) {
      this._items.push(item);
      this._count = this._count + 1;
      this._index = this._count - 1;
      return true;
    }
    return false;
  }

  RemoveItem(): boolean {
    if (this.ValidItem()) {
      this._items = this._items.slice(this._index,1);
      this._count = this._count - 1;
      if (this._index >= this._count) { this._index = this._count - 1; }
      return true;
    }
    return false;
  }

  First(): boolean { return this.Set(0); }
  Last(): boolean { return this.Set(this._count - 1); }
  Next(): boolean { return this.Set(this._index + 1); }
  Previous(): boolean{ return this.Set(this._index - 1); }
  Set(index: number) : boolean {
    if (this.ValidItem()) {
      this._index = index;
      return true;
    }
    return false;
  }
}
export class PlaceType {
  constructor(private _name: string, private parentType: string) { }

  get Name() { return this._name; }
  get Parent() { return this.parentType; }
}

class PlaceA implements IListItem {
  constructor(
    private _idsss: string,
    private _name: string,
    private _type: PlaceType,
    private _parentID: string,
    private _lat = 0.0,
    private _lon = 0.0,
    private _aka: string[] = []) { }

  SelectItemById(id: any): boolean { return this.ID == <string>id; }
  SelectItem(searchData: any): boolean {
    return this.IsPlace(searchData as string);
  }
  get ID() { return this._idsss; }
  get Name() { return this._name; }
  get Parent() { return this._parentID; }
  get Type() { return this._type; }
  IsPlace(name: string): boolean {
    let n = name.toLowerCase();
    return (
      this._name.toLowerCase() == n ||
      this._aka.findIndex(a => a.toLowerCase() == n) >= 0);
  }
}

export class Places extends PlaceA implements IIndexer {
  _indexer: IIndexer;
  constructor(
    id: string,
    name: string,
    type: PlaceType,
    parentID: string,
    lat = 0.0,
    lon = 0.0,
    aka: string[] = [],
    places: PlaceA[] = []) {
    super(id, name, type, parentID, lat, lon, aka);
    this._indexer = new Indexer(places);
  }

  AddPlace(id: string, name: string, type: PlaceType, parentID: string) {
    this.AddItem(new PlaceA(id, name, type, parentID));
  }

  SelectItemById(id: any): boolean { return this._indexer.SelectItemById(id); }
  SelectItem(searchData: any): boolean { return this._indexer.SelectItemById(searchData); }

  ValidItem(): boolean { return this._indexer.ValidItem(); }
  SelectedItem(): any { return this._indexer.SelectedItem(); }
  AddItem(item: any): boolean { return this._indexer.AddItem(item); }
  RemoveItem(index: any): boolean { return this._indexer.RemoveItem(index); }
  First(): boolean { return this._indexer.First(); }
  Last(): boolean { return this._indexer.Last(); }
  Next(): boolean { return this._indexer.Next(); }
  Previous(): boolean { return this._indexer.Previous(); }
  Set(index: number): boolean { return this._indexer.Set(index); }
}

export class HistoricEvent implements IListItem {
  constructor(
    protected _id: string,
    protected _year: number,
    protected _description: string,
    protected _where: string[] = [],
    protected _citation: string = '') { }

  SelectItemById(id: any): boolean { return this._id == <string>id; }
  SelectItem(searchData: any): boolean {
    let data = searchData as { year: number, where: string[] };
    if (this._year != data.year) {
      return false;
    }
    let result = true;
    this._where.forEach(function (p, i) {
      if (data.where[i] != p) {
        result == false;
      }
    });
    return result;
  }

  get ID() { return this._id; }
  get Year() { return this._year; }
  get Description() { return this._description; }
  get Where() { return this._where; }
  get Citation() { return this._citation; }
}

export class HistoricEvents extends HistoricEvent implements IIndexer {
  _indexer: IIndexer ;
  constructor(id: string,
    year: number,
    description: string,
    where: string[] = [],
    citation: string = '',
    events: HistoricEvent[] = []) {
    super(id, year, description, where, citation);
    this._indexer = new Indexer(events);
  }

  private get Event() {
    return this.SelectedItem() as HistoricEvent;
  }

  AddEvent(id: string,
    year: number,
    description: string,
    where: string[] = [],
    citation: string = '') {
    this.AddItem(new HistoricEvent(id, year, description, where, citation));
  }

  SelectItemById(id: any): boolean { return this._indexer.SelectItemById(id); }
  SelectItem(searchData: any): boolean { return this._indexer.SelectItemById(searchData); }

  SelectEventById(id: string): boolean {

    return this.SelectItemById(id);
  }

  SelectEventByTimeAndPlace(year: number, where: string[] = []): boolean {
    return this.SelectItem({year: year,where: where});
  }

  get ID() {
    let e = this.Event;
    return e ? e.ID : this._id;
  }
  get Year() {
    let e = this.Event;
    return e ? e.Year : this._year;
  }
  get Description() {
    let e = this.Event;
    return e ? e.Description : this._description;
  }
  get Where() {
    let e = this.Event;
    return e ? e.Where : this._where;
  }
  get Citation() {
    let e = this.Event;
    return e ? e.Citation : this._citation;
  }
  ValidItem(): boolean { return this._indexer.ValidItem(); }
  SelectedItem(): any { return this._indexer.SelectedItem(); }
  AddItem(item: any): boolean {return this._indexer.AddItem(item);}
  RemoveItem(index: any): boolean { return this._indexer.RemoveItem(index); }
  First(): boolean { return this._indexer.First(); }
  Last(): boolean { return this._indexer.Last(); }
  Next(): boolean { return this._indexer.Next(); }
  Previous(): boolean { return this._indexer.Previous(); }
  Set(index: number): boolean { return this._indexer.Set(index); }
}

export class USState {
  _name: string = "";
  _selected: boolean = false;
  _showCounties: boolean = false;
  _year: number = 1800;
  _abbreviation: string = '';
  constructor(name: string,
    abbreviation: string,
    year: number,
    showCounties: boolean = false) {
    this._name = name;
    this._abbreviation = abbreviation;
    this._selected = false;
    this._showCounties = showCounties;
    this._year = year;
  }

  Update(year: number, layer: VectorLayer) {
    this._year = year;
  }
}

@Component({
  selector: 'ol-map',
  templateUrl: './olMap.component.html',
  styleUrls: ['./olMap.component.css']
})

export class OlMapComponent implements AfterViewInit {
  bgColor: string = 'red';
  mode: string = 'side';
  // _states: string[] = [];
  showTopo: boolean = false;
  _map: Map;
  _mapWidth: number = 0;
  _mapHeight: number = 0;
  _PLSS: VectorLayer = null;
  Year: number = 1800;
  States: USState[] = [];
  _stylesState = [];
  _stylesCounties = [];
  _stylesSelectedCounties = [];
  _historyIndex: any = null;
  _historylayer: VectorLayer = null;
  geolabel: string = "States"
  _events: HistoricEvent[] = [];
  _topoLayer: VectorLayer = null;
  constructor(
    public canvasService: CanvasService,
    private http: HttpClient,
    private httpService: DataHTTPService) {
    this._events.push(new HistoricEvent('shannonCTS4528_census_1880', 1880, '1880 Census', ["USA", "Arkansas", "Drew"]));
    // this.canvasService.A()
  }

  //onMoveEnd(event: any) {
  //  var zoom = this._map.getView().getZoom();
  //  var sss = 0;
  //}

  SectionStyles() {
    let styles = this._stylesState = [
      /* We are using two different styles for the polygons:
       *  - The first style is for the polygons themselves.
       *  - The second style is to draw the vertices of the polygons.
       *    In a custom `geometry` function the vertices of a polygon are
       *    returned as `MultiPoint` geometry, which will be used to render
       *    the style.
       */
      new Style({
        stroke: new Stroke({
          color: 'rgba(80, 80, 80, 0.9)',
          width: 0.5
        }),
        fill: new Fill({
          color: 'rgba(180, 180, 180, 0.9)'
        })
      })
    ];
  }

  get PLSSStyles() {
    //   let name = feature.get('Name');
    let fill = 'rgba(140, 140, 140, 0.5)';
    //if (name == 'John C. Shannon') {
    //  fill == 'rgba(140, 20, 140, 0.9)';
    //}
    return [
      /* We are using two different styles for the polygons:
       *  - The first style is for the polygons themselves.
       *  - The second style is to draw the vertices of the polygons.
       *    In a custom `geometry` function the vertices of a polygon are
       *    returned as `MultiPoint` geometry, which will be used to render
       *    the style.
       */
      new Style({
        stroke: new Stroke({
          color: 'rgba(80, 80, 80, 0.9)',
          width: 0.5
        }),
        fill: new Fill({
          color: fill
        })
      })
    ];
  }

  ngAfterViewInit() {

    let self = this;
    let source: any;
    let layer: any;
    let tilelayer: any;
    let view: any;
    let iconFeatures = [];

    this._stylesState = [
      /* We are using two different styles for the polygons:
       *  - The first style is for the polygons themselves.
       *  - The second style is to draw the vertices of the polygons.
       *    In a custom `geometry` function the vertices of a polygon are
       *    returned as `MultiPoint` geometry, which will be used to render
       *    the style.
       */
      new Style({
        stroke: new Stroke({
          color: 'rgba(80, 80, 80, 0.9)',
          width: 0.3
        }),
        fill: new Fill({
          color: 'transparent'
        })
      })
    ];

    var stylesShore = [
      /* We are using two different styles for the polygons:
       *  - The first style is for the polygons themselves.
       *  - The second style is to draw the vertices of the polygons.
       *    In a custom `geometry` function the vertices of a polygon are
       *    returned as `MultiPoint` geometry, which will be used to render
       *    the style.
       */
      new Style({
        stroke: new Stroke({
          color: 'rgba(128, 128, 128, 0.9)',
          width: 0.5
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)'
        })
      })
    ];
    var stylesRiver = [
      /* We are using two different styles for the polygons:
       *  - The first style is for the polygons themselves.
       *  - The second style is to draw the vertices of the polygons.
       *    In a custom `geometry` function the vertices of a polygon are
       *    returned as `MultiPoint` geometry, which will be used to render
       *    the style.
       */
      new Style({
        stroke: new Stroke({
          color: 'rgba(178, 178, 178, 0.3)',
          width: 0.5
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)'
        })
      })
    ];
    this._stylesSelectedCounties = [
      /* We are using two different styles for the polygons:
       *  - The first style is for the polygons themselves.
       *  - The second style is to draw the vertices of the polygons.
       *    In a custom `geometry` function the vertices of a polygon are
       *    returned as `MultiPoint` geometry, which will be used to render
       *    the style.
       */
      new Style({
        stroke: new Stroke({
          color: 'rgba(	255,228,196, 0.8)',
          width: 0.5
        }),
        fill: new Fill({
          color: 'rgba(205,133,63, 0.4)'
        })
      })
    ];
    this._stylesCounties = [
      /* We are using two different styles for the polygons:
       *  - The first style is for the polygons themselves.
       *  - The second style is to draw the vertices of the polygons.
       *    In a custom `geometry` function the vertices of a polygon are
       *    returned as `MultiPoint` geometry, which will be used to render
       *    the style.
       */
      new Style({
        stroke: new Stroke({
          color: 'rgba(20, 178, 178, 0.8)',
          width: 0.5
        }),
        fill: new Fill({
          color: 'rgba(200, 255, 200, 0.1)'
        })
      })
    ];
    //this.source = new XYZ({
    //  // Tiles from Mapbox (Light)
    //  url: 'https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    //});
    //var extent = proj.transform([-180, -85.051129, 179.976804, 85.051129],
    //  'EPSG:4326', 'EPSG:3857');
    //var center = proj.transform([-0.011598000000006436, 0],
    //  'EPSG:4326', 'EPSG:3857');

    //source = new XYZ("Local Tiles", 'largeearthwithwater/${z}/${x}/${y}.png',
    //{
    //  url: 'http://localhost:52896/largeearthwithwater/{z}/{x}/{y}.png',
    //  extent: extent,
    //  minZoom: 0,
    //  maxZoom: 5,
    //  wrapx: false,
    //  isBaseLayer: true
    //  });
    let attribution = new Attribution({
      html: 'Tiles &copy; <a href="http://maps.nls.uk/townplans/glasgow_1.html">' +
        'National Library of Scotland</a>'
    });
    let mapExtent = proj.transformExtent([-180.000000, -85.051129, 179.996547, 85.051129], 'EPSG:4326', 'EPSG:3857');
    let mapMinZoom = 4;
    let mapMaxZoom = 7;
    source = new OSM({
      //   attributions: [new Attribution({ html: 'tiles' })],"naturalearth2/NaturalEarthCoastlines.geojson",// 
      url: "naturalearth2/{z}/{x}/{y}.png",
      tilePixelRatio: 1.000000,
      minZoom: mapMinZoom,
      maxZoom: mapMaxZoom
    });

    this._topoLayer = new TileLayer({
      extent: mapExtent,
      source: source
    });
    let shorelinelayer = new VectorLayer({
      style: stylesShore,
      source: new VectorSource({
        url: 'naturalearth2/NaturalEarthCoastlines.geojson',
        format: new GeoJSON()

      })
    });
    shorelinelayer.setVisible(true);
    this._topoLayer.setVisible(false);
    let riverlayer = new VectorLayer({
      style: stylesRiver,
      source: new VectorSource({
        url: 'naturalearth2/worldrivers.geojson',
        format: new GeoJSON()
      }),
      maxResolution: 5000
    });

    this._historylayer = new VectorLayer({

      style: this._stylesState,
      source: new VectorSource({
        url: 'naturalearth2/GeoJson/USStates_' + this.Year + '.geojson',
        format: new GeoJSON()
      }),
      maxResolution: 5000
    });

    this._PLSS = new VectorLayer({

      style: this.PLSSStyles,
      source: new VectorSource({
        url: 'naturalearth2/GeoJson/plss.geojson',
        format: new GeoJSON()
      }),
      maxResolution: 500
    });

    let lakelayer = new VectorLayer({

      style: stylesRiver,
      source: new VectorSource({
        url: 'naturalearth2/lakes.geojson',
        format: new GeoJSON()
      }),
      maxResolution: 5000
    });
    let modernlayer = new Tile({
      extent: mapExtent,
      source: new OSM()
    });

    view = new View({
      center: [-472202, 7530279],
      zoom: 5
    });

    iconFeatures.push(new Feature({
      geometry: new geom.Point(proj.transform([-2.944, 54.891], 'EPSG:4326', 'EPSG:3857')),
      name: 'Carlisle'
    }));
    iconFeatures.push(new Feature({
      geometry: new geom.Point(proj.transform([21.833333, 46.583333], 'EPSG:4326', 'EPSG:3857')),
      name: 'Santana, Romania'
    }));

    var iconStyle = new Style({
      //image: new Icon({
      //  anchor: [0.5, 46],
      //  anchorXUnits: 'fraction',
      //  anchorYUnits: 'pixels',
      //  opacity: 0.75,
      //  src: '//openlayers.org/en/v3.8.2/examples/data/icon.png'
      //}),
      text: new Text({
        font: 'normal 18px FontAwesome',
        fill: new Fill({ color: 'red' }),
        stroke: new Stroke({
          color: '#fff', width: 2
        }),
        text: '\uf041'
      })
    });

    var vectorSource = new VectorSource({
      features: iconFeatures //add an array of features
    });

    let vectorLayer = new VectorLayer({
      source: vectorSource,
      style: iconStyle
    });

    this._map = new Map({
      target: 'map',
      layers: [
        this._topoLayer,
        shorelinelayer,
        lakelayer,
        riverlayer,
        this._PLSS,
        //       this._historylayer,
        vectorLayer],
      view: view
    });
    this.IncrementYear(0);
    setTimeout(() =>
      this._map.render(), 0);
    //this.httpService.getContent(null, 'https://gis.blm.gov/arcgis/rest/services/Cadastral/BLM_Natl_PLSS_CadNSDI/MapServer/exts/CadastralSpecialServices/GetLatLon?trs=WA330200N0280E0SN340+%7C+&returnalllevels=&f=pjson&__ncforminfo=7x7RLQJqpDQ92T4PQI_-wSk34fhSp0krCuCkP5nOMe9rVpPf2stN7FAL0CQsbN_c62SdT15Xs7Rs5U4Xfe3epxz0dE12hq0HyWAsrAz430mfnjihcVff8g%3D%3D')
    //  .subscribe(
    //    data => { this.RetrieveShapeSuccess(data) },
    //  err => { this.Fail(err) });
    let msz = this._map.getSize();
    let ext = this._map.getView().calculateExtent();
    let historyIndex;
    this.http.get("../naturalearth2geojson/ushistory/historyindex.json")
      .subscribe((success) => {
        // 'naturalearth2/GeoJson/'
        //this.navItems = success.json();
        self._historyIndex = success;
      });

  }

  RetrieveShapeSuccess(data: any) {
    let sss = 0;
  }

  Fail(data: any) {
    let sss = 0;
  }

  @HostListener('click') onClick() {
    var zoom = this._map.getView().getZoom();
    var sss = 0;
    //   this.drawer.toggle();
  }

  StateAbbreviation(stateName: string) {
    let abr: string = '';
    switch (stateName) {
      case "Illinois": abr = "IL"; break;
      case "Missouri": abr = "MO"; break;
      case "Indiana": abr = "IN"; break;
      case "Texas": abr = "TX"; break;
      case "Tennessee": abr = "TN"; break;
      case "Arkansas": abr = "AR"; break;
      case "Louisiana": abr = "LA"; break;
      case "Mississippi": abr = "MS"; break;
      case "Florida": abr = "FL"; break;
      case "Alabama": abr = "AL"; break;
      case "Ohio": abr = "OH"; break;
      case "Rhode Island": abr = "RI"; break;
      case "Kentucky": abr = "KY"; break;
      case "Massachusetts": abr = "MA"; break;
      case "Virginia": abr = "VA"; break;
      case "Maryland": abr = "MD"; break;
      case "New Hampshire": abr = "NH"; break;
      case "North Carolina": abr = "NC"; break;
      case "Connecticut": abr = "CT"; break;
      case "Pennsylvania": abr = "PA"; break;
      case "New Jersey": abr = "NJ"; break;
      case "Delaware": abr = "DE"; break;
      case "New York": abr = "NY"; break;
      case "Georgia": abr = "GA"; break;
      case "Vermont": abr = "VT"; break;
      case "South Carolina": abr = "SC"; break;
      default: abr = stateName; break;
    }
    //Alabama - AL

    //Alaska - AK

    //Arizona - AZ

    //Arkansas - AR

    //California - CA

    //Colorado - CO

    //Connecticut - CT

    //Delaware - DE

    //Florida - FL

    //Georgia - GA

    //Hawaii - HI

    //Idaho - ID

    //Illinois - IL

    //Indiana - IN

    //Iowa - IA

    //Kansas - KS

    //Kentucky - KY

    //Louisiana - LA

    //Maine - ME

    //Maryland - MD

    //Massachusetts - MA

    //Michigan - MI

    //Minnesota - MN

    //Mississippi - MS

    //Missouri - MO

    //Montana - MT

    //Nebraska - NE

    //Nevada - NV

    //New Hampshire - NH

    //New Jersey - NJ

    //New Mexico - NM

    //New York - NY

    //North Carolina - NC

    //North Dakota - ND

    //Ohio - OH

    //Oklahoma - OK

    //Oregon - OR

    //Pennsylvania - PA

    //Rhode Island - RI

    //South Carolina - SC

    //South Dakota - SD

    //Tennessee - TN

    //Texas - TX

    //Utah - UT

    //Vermont - VT

    //Virginia - VA

    //Washington - WA

    //West Virginia - WV

    //Wisconsin - WI

    //Wyoming - WY
    return abr;
  }

  ParseFeatureProperies(feature: any) {
    let p = feature.getProperties();
    let state = this.States.find(s => s._name === p.Name);
    if (p.Name.toUpperCase().indexOf('DREW') >= 0) {
      feature.setStyle(this._stylesSelectedCounties);
    }
    if (!state) {
      let state = new USState(p.Name, this.StateAbbreviation(p.Name), this.Year);
      this.States.push(state);
    }
    else {
      state.Update(this.Year, null);
    }
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.MapSize();
    //  this.ReDraw();
  }


  @HostListener('mousewheel', ['$event']) onScroll() {
    var zoom = this._map.getView().getZoom();
    // this._map.layers[2].setVisible(zoom >= 4);
    // console.error(zoom);
  }

  //ClearLayers(){
  //    let self = this;
  //    this.States.forEach( s => self._map.removeLayer( s._layer ));
  //    this.States = [];
  //}

  SwitchCountyLayer(name: string, abbreviation: string, year: number, showCounties: boolean = false) {

    let state = this.States.find(s => s._name === name);
    if (!state) {
      state = new USState(name, abbreviation, year, showCounties);
      this.States.push(state);
    }
    else {
      state.Update(year, null);
    }
    this.AddCountyLayer(state);
  }

  RemoveAllCountyLayers() {
    let self = this;
    this._map.getLayers().forEach(function (l, i) {
      if (l) {
        let n: string = l.get('name');
        if (n && n.includes("_counties")) {
          self._map.removeLayer(l);
        }
      }
    });
  }

  RemoveCountyLayer(state: USState) {
    let self = this;
    let name = state._name + "_counties";
    let layers: any[] = this._map.getLayers();
    layers.forEach(function (l, i) {
      if (l && l.get('name') == name) {
        self._map.removeLayer(l);
      }
    });
  }

  AddCountyLayers(state: string, year: number) {
    let self = this;
    let results = this._historyIndex.filter(f => f.SourceFile.indexOf(state + "_") == 0);
    results.forEach(function (f, i) {
      let features = f.range.filter(r => r.Y1 <= year && year < r.Y2);
      features.forEach(function (ff, j) {
        let vlayer = new VectorLayer({
          style: self._stylesCounties,
          source: new VectorSource({
            url: 'naturalearth2GeoJson/ushistory/' + f.SourceFile + '/' + ff.File + '.geojson',
            format: new GeoJSON()
          }),
          maxResolution: 5000
        });
        vlayer.set('name', state + "_counties");
        vlayer.set('year', year);
        self._map.addLayer(vlayer);
      });
    });

  }

  AddCountyLayer(state: USState) {

    this.AddCountyLayers(state._abbreviation, this.Year);
    //let vlayer = new VectorLayer({
    //  style: this._stylesCounties,
    //  source: new VectorSource({
    //    url: 'naturalearth2/GeoJson/' + state._abbreviation + '_Historical_Counties_' + this.Year + '.geojson',
    //    format: new GeoJSON()
    //  }),
    //  maxResolution: 5000
    //});
    //vlayer.set('name', state._name + "_counties");
    //vlayer.set('year', this.Year);
    //this._map.addLayer(vlayer);
    //let self = this;
    //vlayer.getSource().on('change', function (evt) {
    //  var source = evt.target;
    //  var features = source.getFeatures();
    //  features.forEach(f => self.ParseFeatureProperies(f));
    //});
  }
  //https://www.legallandconverter.com/p43.html
  //https://mygeodata.cloud/converter/latlong-to-geojson
  //http://www.acuriousanimal.com/thebookofopenlayers3/
  // https://publications.newberry.org/ahcbp/downloads/index.html
  IncrementYear(increment: number) {
    this.Year += increment;
    //  this.States = [];
    this.geolabel = (this.Year > 1770) ? "States" : "Colonies";
    this.RemoveAllCountyLayers();
    if (this._historylayer) {
      this._map.removeLayer(this._historylayer);
      this._historylayer = null;
    }
    if (this.Year <= 1630) {
      this.SwitchCountyLayer("Massachusetts", "MA", this.Year, true);
      this.SwitchCountyLayer("Rhode Island", "RI", this.Year, true);
    }
    else if (this.Year <= 1640) {
      this.SwitchCountyLayer("Massachusetts", "MA", this.Year, true);
      this.SwitchCountyLayer("Virginia", "VA", this.Year, true);
      this.SwitchCountyLayer("Maryland", "MD", this.Year, true);
      this.SwitchCountyLayer("Rhode Island", "RI", this.Year, true);
    }
    else if (this.Year <= 1660) {
      this.SwitchCountyLayer("Massachusetts", "MA", this.Year, true);
      this.SwitchCountyLayer("Virginia", "VA", this.Year, true);
      this.SwitchCountyLayer("Maryland", "MD", this.Year, true);
      this.SwitchCountyLayer("New Hampshire", "NH", this.Year, true);
      this.SwitchCountyLayer("Rhode Island", "RI", this.Year, true);
    }
    else if (this.Year <= 1670) {
      this.SwitchCountyLayer("Massachusetts", "MA", this.Year, true);
      this.SwitchCountyLayer("Virginia", "VA", this.Year, true);
      this.SwitchCountyLayer("Maryland", "MD", this.Year, true);
      this.SwitchCountyLayer("New Hampshire", "NH", this.Year, true);
      this.SwitchCountyLayer("North Carolina", "NC", this.Year, true);
      this.SwitchCountyLayer("Connecticut", "CT", this.Year, true);
      this.SwitchCountyLayer("Pennsylvania", "PA", this.Year, true);
      this.SwitchCountyLayer("New York", "NY", this.Year, true);
      this.SwitchCountyLayer("Rhode Island", "RI", this.Year, true);
    }
    else if (this.Year <= 1710) {
      this.SwitchCountyLayer("Massachusetts", "MA", this.Year, true);
      this.SwitchCountyLayer("Virginia", "VA", this.Year, true);
      this.SwitchCountyLayer("Maryland", "MD", this.Year, true);
      this.SwitchCountyLayer("New Hampshire", "NH", this.Year, true);
      this.SwitchCountyLayer("North Carolina", "NC", this.Year, true);
      this.SwitchCountyLayer("Connecticut", "CT", this.Year, true);
      this.SwitchCountyLayer("Pennsylvania", "PA", this.Year, true);
      this.SwitchCountyLayer("New Jersey", "NJ", this.Year, true);
      this.SwitchCountyLayer("Delaware", "DE", this.Year, true);
      this.SwitchCountyLayer("New York", "NY", this.Year, true);
      this.SwitchCountyLayer("Rhode Island", "RI", this.Year, true);
    }
    else if (this.Year <= 1750) {
      this.SwitchCountyLayer("Massachusetts", "MA", this.Year, true);
      this.SwitchCountyLayer("Virginia", "VA", this.Year, true);
      this.SwitchCountyLayer("Maryland", "MD", this.Year, true);
      this.SwitchCountyLayer("New Hampshire", "NH", this.Year, true);
      this.SwitchCountyLayer("North Carolina", "NC", this.Year, true);
      this.SwitchCountyLayer("Connecticut", "CT", this.Year, true);
      this.SwitchCountyLayer("Pennsylvania", "PA", this.Year, true);
      this.SwitchCountyLayer("New Jersey", "NJ", this.Year, true);
      this.SwitchCountyLayer("Delaware", "DE", this.Year, true);
      this.SwitchCountyLayer("New York", "NY", this.Year, true);
      this.SwitchCountyLayer("South Carolina", "SC", this.Year, true);
      this.SwitchCountyLayer("Rhode Island", "RI", this.Year, true);
    }
    else if (this.Year <= 1780) {
      this.SwitchCountyLayer("Massachusetts", "MA", this.Year, true);
      this.SwitchCountyLayer("Virginia", "VA", this.Year, true);
      this.SwitchCountyLayer("Maryland", "MD", this.Year, true);
      this.SwitchCountyLayer("New Hampshire", "NH", this.Year, true);
      this.SwitchCountyLayer("North Carolina", "NC", this.Year, true);
      this.SwitchCountyLayer("Connecticut", "CT", this.Year, true);
      this.SwitchCountyLayer("Pennsylvania", "PA", this.Year, true);
      this.SwitchCountyLayer("New Jersey", "NJ", this.Year, true);
      this.SwitchCountyLayer("Delaware", "DE", this.Year, true);
      this.SwitchCountyLayer("New York", "NY", this.Year, true);
      this.SwitchCountyLayer("Georgia", "GA", this.Year, true);
      this.SwitchCountyLayer("South Carolina", "SC", this.Year, true);
      this.SwitchCountyLayer("Rhode Island", "RI", this.Year, true);
    }
    else {

      this._historylayer = new VectorLayer({
        style: this._stylesState,
        source: new VectorSource({
          url: 'naturalearth2/GeoJson/USStates_' + this.Year + '.geojson',
          format: new GeoJSON()
        }),
        maxResolution: 5000
      });
      let self = this;
      this._historylayer.getSource().on('change', function (evt) {
        var source = evt.target;
        var features = source.getFeatures();
        features.forEach(f => self.ParseFeatureProperies(f));
      });
      this._map.addLayer(this._historylayer);
      this.States.filter(s => s._selected).forEach(function (x, i) {
        self.RemoveCountyLayer(x);
        self.AddCountyLayer(x);
      });
    }
  }

  PreviousDecade() {
    if (this.Year > 1600) {
      this.IncrementYear(-10);
    }
    let msz = this._map.getSize();
    let ext = this._map.getView().calculateExtent();

  }

  NextDecade() {
    if (this.Year < 1900) {
      this.IncrementYear(10);
    }
  }

  get MapWidth() {
    return this._mapWidth;
  }

  get MapHeight() {
    return this._mapHeight;
  }

  MapSize() {
    let sz = this._map.getSize();
    this._mapWidth = sz[0];
    this._mapHeight = sz[1];
  }

  SelectState(event: any, item: number) {
    let state = this.States[item];
    state._selected = event.checked;
    var name = this.States[item]._name;
    var abr = this.StateAbbreviation(name);
    this.RemoveCountyLayer(state);
    this.AddCountyLayer(state);
  }

  Checked(item: number) {
    let state = this.States[item];
    return state && state._selected;
  }

  ToggleTopo(item: any) {
    this._topoLayer.setVisible(this.showTopo);
  }

  AddShape(lat: number, lon: number) {

  }
}

    //new Tile({
    //  source: new XYZ({
    //    attributions: [attribution],
    //    url: 'http://geo.nls.uk/maps/towns/glasgow1857/{z}/{x}/{-y}.png'
    //  })
    //}),
