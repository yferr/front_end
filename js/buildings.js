import axios from 'axios';
import { URL_API, URL_GEOSERVER } from './settings';

export function insert(){
    let descripcion=document.getElementById('form-buildings-descripcion').value;
    let geomWkt=document.getElementById('form-buildings-geomWkt').value;

    axios.post(URL_API + '/appdesweb/building_insert/',
    {descripcion:descripcion,geomWkt:geomWkt}, {withCredentials: true})
    .then(function (response) {
    // handle success
            console.log(response);
            document.getElementById("form-building-message").innerHTML=response.data.message;

        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
            console.log('Finally')
    });
}