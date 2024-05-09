
import {muestraMensaje} from './buildings'

export function enlazaEventos(){
    console.log('Enlazando eventos');
    document.getElementById('button-test').addEventListener('click', muestraMensaje);
    console.log('Eventos enlazados');
}

