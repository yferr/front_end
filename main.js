import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

import { registerEvents } from './js/registerEvents';
import { helloWord } from './js/helloWorld';

//import { enlazaEventos } from './js2/enlazaEventos';

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

registerEvents();
helloWord();
