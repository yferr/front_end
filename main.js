import './style.css'
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
//import {Map, View} from 'ol';
//import TileLayer from 'ol/layer/Tile';
//import OSM from 'ol/source/OSM';

import { registerEvents } from './js/registerEvents';
//import { muestraMensaje } from './js/mensaje';
import { login } from './js/login';
import { logout } from './js/login';

import { MapMain } from './js/map/mapMain';
import { setMAP_MAIN } from './js/settings';

setMAP_MAIN(new MapMain());
registerEvents();
login();
logout();
//creates the map and sets the MAP_MAIN global variable
//const mapMainInstance = new MapMain();
//window.mapMain = mapMainInstance; // Make it globally accessible
