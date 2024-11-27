import axios from 'axios';
import { MAP_MAIN, URL_API, URL_GEOSERVER } from './settings';



//iconos mapa
//
export function startDrawing(){
    //Enables de draw interaction
    MAP_MAIN.startDrawing();
    console.log("Draw poligon interaction active")
}

export function eraseLayer(){
    MAP_MAIN.eraseLayer();
    console.log("Vector erased")
}

export function downloadPolygon(){
    MAP_MAIN.downloadPolygon();
}
