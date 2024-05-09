import axios from 'axios';

export function getHelloWord(){
    axios.get('http://localhost:8000/appdesweb/hello_world/')
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

