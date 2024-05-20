import axios from 'axios';
import { URL_API } from './settings';

export function helloWord(){
    axios.get(URL_API + '/appdesweb/hello_world/')
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