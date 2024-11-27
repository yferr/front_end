import { Map, View } from 'ol';
// to create wms layers
import TileLayer from 'ol/layer/Tile';
// to create wms sources
import TileWMS from 'ol/source/TileWMS.js';
// to change the map view projection
import { Projection } from 'ol/proj';
// Layer switcher control
import LayerSwitcher from 'ol-layerswitcher';
// Mouse position control
import MousePosition from 'ol/control/MousePosition.js';
// Scaleline control
import { ScaleLine } from 'ol/control.js';
// Function to round coordinates
import { createStringXY } from 'ol/coordinate.js';
// Groups are used to group layers
import { Group as LayerGroup } from 'ol/layer.js';

// importing the OpenStreetMap source
import OSM from 'ol/source/OSM.js';
//geometry types
import {LineString, Point, Polygon} from 'ol/geom.js';
//interactions to draw and modify map objects
import {Draw, Modify} from 'ol/interaction.js';
import {Vector as VectorLayer} from 'ol/layer';
import {Vector as VectorSource} from 'ol/source.js';
//needed to style the vector layers
import {Circle as CircleStyle, Fill, RegularShape, Stroke, Style, Text} from 'ol/style.js';
import {WKT} from 'ol/format'

import { URL_GEOSERVER } from '../settings';

export class MapMain {
  constructor() {
    this.map = undefined;
    this.layersArray = undefined;

    // We will need to access these layers later
    this.wms_ndvi_layer = undefined;
    this.wms_nnir_layer = undefined;
    this.wms_ndre_layer = undefined;
    

    this.vector_layer_source_draw=undefined;//the object to draw
    this.vector_layer_draw_interaction=undefined;//the draw interaction
    this.lastDrawnFeature = null;
    //this.polygon = null; // Variable to hold the drawn polygon
    this.vector_layer=undefined;//the vector layer

    this.point = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": []
      },
      "properties": {}
    };
    this.geolocationOptions = {
      enableHighAccuracy: true,
      timeout: 10000 // milliseconds
    };

    this.setLayersArray();
    this.setMap();
    this.setMapControls();
    this.populateLegend(); // Initialize the legend for visible layers
    this.addDrawInteraction(); 
    //this.showToast();
    //this.centerMap();     
    this.eraseLayer();
    
  }

  setLayersArray() {
    //// OpenStreetMap as the base layer
    //var osmLayer = new TileLayer({
    //  source: new OSM(),
    //  name: 'OSM',
    //  visible: true,
    //  title: 'OpenStreetMap',
    //});

    var pnoa = new TileLayer({
      source: new TileWMS({       
          url: 'http://www.ign.es/wms-inspire/pnoa-ma',
          params: {"LAYERS": "OI.OrthoimageCoverage", 'VERSION': "1.3.0", "TILED": "true"},
          attributions: ["PNOA-MA"]
      }),
      name: 'PNOA', 
      description: 'PNOA', 
      visible: true, 
      title:'PNOA',
      //type: 'base'
    });

    // NDVI Layer from GeoServer
    this.wms_ndvi_layer = new TileLayer({
      source: new TileWMS({
        url: URL_GEOSERVER + '/wms?',
        params: { "LAYERS": "indices:NDVI", "STYLES": "indices:NDVI_style", 'VERSION': "1.3.0", "TILED": "true", 'SRS': 'EPSG:25830' },
      }),
      title: "NDVI",
      visible: false, // Initially hidden
    });

    // NNIR Layer from GeoServer
    this.wms_nnir_layer = new TileLayer({
      source: new TileWMS({
        url: URL_GEOSERVER + '/wms?',
        params: { "LAYERS": "indices:NNIR", "STYLES": "indices:NNIR_style", 'VERSION': "1.3.0", "TILED": "true", 'SRS': 'EPSG:25830' },
      }),
      title: "NNIR",
      visible: false, // Initially hidden
    });

    // NDRE Layer from GeoServer
    this.wms_ndre_layer = new TileLayer({
      source: new TileWMS({
        url: URL_GEOSERVER + '/wms?',
        params: { "LAYERS": "indices:NDRE", "STYLES": "indices:NDRE_style", 'VERSION': "1.3.0", "TILED": "true", 'SRS': 'EPSG:25830' },
      }),
      title: "NDRE",
      visible: true, // Default active layer
    });
    
    var vector_draw_style = new Style({
      fill: new Fill({
        color: '#D7DF01'
      }),
      stroke: new Stroke({
        color: '#DF013A',
        width: 3,
        lineJoin: 'round'
      }),
      image: new CircleStyle({
          radius: 4,
          fill: new Fill({
            color: '#DF013A'
          })
        })
      });

    this.vector_layer_source_draw = new VectorSource({wrapX: false}); //needed for draw
    this.vector_layer= new VectorLayer({
      source: this.vector_layer_source_draw,
      title: 'Polígono'

    });//The layer were we will draw
    this.vector_layer.setStyle(vector_draw_style);
    this.vector_layer.setOpacity(0.5);

  const baselayers = new LayerGroup({
    title: 'Base layers:',
    layers: [pnoa],
  });

  const rasterLayers = new LayerGroup({
    title: 'Raster Layers:',
    layers: [this.wms_ndvi_layer, this.wms_nnir_layer, this.wms_ndre_layer],
    });

  this.layersArray = [baselayers, rasterLayers, this.vector_layer];

  }

  setMap() {
    // Defining the EPSG:32630 projection
    let epsg25830 = new Projection({
      code: 'EPSG:25830',
      extent: [249999.95,4099999.95, 839999.95, 4600000.05],   ///this extent it's valid meanwhile we work with valencia city
      units: 'm',
    });

    // Creating the map object
    this.map = new Map({
      target: 'map',
      layers: this.layersArray,
      renderer: 'canvas',
      view: new View({
        projection: epsg25830,
        maxZoom: 28, minZoom: 1,
        center: [724950.649,4371212.645], // Center within the BBOX  --- here for the future i thing its better to get the real time position  
        zoom: 5, // Adjusted for raster visibility
      }),
    });

    // Listen to layer visibility change events to update legend
    this.map.getLayers().forEach(layer => {
      // Check if the layer is a LayerGroup
      if (layer instanceof LayerGroup) {
        layer.getLayers().forEach(innerLayer => {
          innerLayer.on('change:visible', () => {
            this.populateLegend(); // Update legend when visibility changes
          });
        });
      } else {
        // If it's not a LayerGroup, check if it's a Layer and attach the event directly
        layer.on('change:visible', () => {
          this.populateLegend(); // Update legend when visibility changes
        });
      }
    });


    //this.map.getLayers().forEach(layerGroup => {
    //  layerGroup.getLayers().forEach(layer => {
    //    layer.on('change:visible', () => {
    //      this.populateLegend(); // Update legend when visibility changes
    //    });
    //  });
    //});
  }

  setMapControls() {
    const layerSwitcher = new LayerSwitcher({
      activationMode: 'mouseover',
      startActive: false,
      tipLabel: 'Show-hide layers',
      groupSelectStyle: 'group',
      reverse: true,
    });

    const mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(0),
      projection: 'EPSG:25830',
      undefinedHTML: '&nbsp;',
    });

    const sl = new ScaleLine({ units: 'metric' });

    this.map.addControl(layerSwitcher);
    this.map.addControl(mousePositionControl);
    this.map.addControl(sl);
  }

  showToast(message) {
    var toast = document.getElementById("toast");
    
    toast.innerHTML = message;
    
    toast.style.display = "block";
    
    setTimeout(function(){toast.style.display = "none";}, 5000);
    // delay = 5000 ms
  }

  //centerMap() {
  //  if (navigator.geolocation) {
  //    navigator.geolocation.getCurrentPosition(
  //      (position) => {
  //        this.point.geometry.coordinates = [position.coords.longitude, position.coords.latitude];
  //        this.map.setView(this.point.geometry.coordinates.toReversed(), 16);
  //      },
  //      (error) => {
  //        this.geolocationError(error);
  //      },
  //      this.geolocationOptions
  //    );
  //  } else {
  //    showToast("Geolocation service not supported.");
  //  }
  //}
//
  //geolocationError(error) {
  //  switch(error.code) {
  //    case error.PERMISSION_DENIED:
  //      showToast("Geolocation request denied.");
  //      break;
  //    case error.POSITION_UNAVAILABLE:
  //      showToast("Position unavailable.");
  //      break;
  //    case error.TIMEOUT:
  //      showToast("Geolocation request timed out.");
  //      break;
  //    case error.UNKNOWN_ERROR:
  //      showToast("Unknown geolocation error.");
  //      break;
  //  }
  //}
//

  populateLegend() {
    const legendContent = document.getElementById('legend');

    // Clear previous content
    legendContent.innerHTML = '';

    // Get the currently visible WMS layer
    const visibleLayer = this.getVisibleWMSLayer();

    if (visibleLayer) {
      // Fetch legend image from GeoServer
      const layerTitle = visibleLayer.get('title');
      const legendUrl = `${URL_GEOSERVER}/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=125&HEIGHT=120&LAYER=indices:${layerTitle}&STYLE=indices:${layerTitle}_style`;

      // Create the legend entry
      const entry = document.createElement('div');
      entry.innerHTML = `<strong>${layerTitle}</strong><br/>
        <img src="${legendUrl}" alt="${layerTitle} legend" style="width: 100px; height: auto;100px">`;
      legendContent.appendChild(entry);
    }
  }

  getVisibleWMSLayer() {
    // Loop through the raster layers only and return the visible one
    const rasterLayersGroup = this.layersArray[1]; // Assuming the second group is raster layers
    for (const layer of rasterLayersGroup.getLayers().getArray()) {
        if (layer instanceof TileLayer && layer.getVisible() && layer.getSource() instanceof TileWMS) {
            return layer; // Return the visible WMS layer
        }
    }
    return null; // No visible WMS layer found
  }

  addDrawInteraction() {
    this.vector_layer_draw_interaction = new Draw({
      source: this.vector_layer_source_draw, // Source of the layer where the polygons will be drawn
      type: 'Polygon' // Geometry type
    });

    // When a polygon is drawn, the callback function manageDrawEnd will be executed.
    this.vector_layer_draw_interaction.on('drawend', this.manageDrawEnd.bind(this));

    // Adds the interaction to the map.
    this.map.addInteraction(this.vector_layer_draw_interaction);
  }


  manageDrawEnd(e) {
    var feature = e.feature; // This is the feature that fired the event
    this.lastDrawnFeature = feature; // Store the last drawn feature
    var wktFormat = new WKT(); // An object to get the WKT format of the geometry
    var wktRepresentation = wktFormat.writeGeometry(feature.getGeometry()); // Geometry in WKT
    console.log(wktRepresentation); // Logs a message
    document.getElementById("geomWkt").value = wktRepresentation; // Set the geometry in WKT format to the geomWkt input

  }
  startDrawing() {
    this.vector_layer_draw_interaction.setActive(true); // Start drawing
  }

  eraseLayer() {
    //this.vector_layer_draw_interaction.setActive(false);
    this.vector_layer_source_draw.clear(); // Clear the source layer
    this.lastDrawnFeature = null; // Reset the last drawn feature
  }
  

  downloadPolygon() {
    if (!this.lastDrawnFeature) {
      console.error("No polygon drawn to download.");
      return; // Exit if no feature is available
    }

    // Extract coordinates from the last drawn polygon feature
    const coordinates = this.lastDrawnFeature.getGeometry().getCoordinates()[0]; // Get the outer ring coordinates

    // Format the coordinates into a string
    const coordString = coordinates.map(coord => `${coord[0]},${coord[1]}`).join(';'); // Join coordinates with a semicolon

    // Create CSV content
    const csvContent = `polygon\n${coordString}\n`;

    // Create a blob and a link to download the CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "polygon_coordinates.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
