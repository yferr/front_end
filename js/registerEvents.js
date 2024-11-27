import {login, logout} from './login';
import {startDrawing, eraseLayer, downloadPolygon} from './polygons.js';

export function registerEvents(){
    document.getElementById('button-login').addEventListener('click',login);
    document.getElementById('button-logout').addEventListener('click',logout);

    document.getElementById('start-drawing').addEventListener('click',startDrawing);
    document.getElementById('erase-layer').addEventListener('click',eraseLayer);
    document.getElementById('download-polygon').addEventListener('click', downloadPolygon); 
}


