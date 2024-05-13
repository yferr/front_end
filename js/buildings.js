import axios from 'axios';

export function insert(){
    let descripcion=document.getElementById('form-buildings-descripcion').value;
    let geomWkt=document.getElementById('form-buildings-geomWkt').value;

    axios.post('http://localhost:8000/appdesweb/building_insert/',
    {descripcion:descripcion,geomWkt:geomWkt}, {withCredentials: true})
    .then(function (response) {
    // handle success
            console.log(response);
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