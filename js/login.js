import axios from 'axios';

export function login(){
    var username=document.getElementById('username').value;
    var password=document.getElementById('password').value;

    axios.post('http://localhost:8000/appdesweb/app_login/',
        {username:username,password:password}, {withCredentials: true})
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

