import axios from 'axios';
import { URL_API } from './settings';

export function login() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  axios.post(URL_API + '/appdesweb/app_login/', { username: username, password: password }, { withCredentials: true })
    .then(function (response) {
      // handle success
      console.log(response);
      document.getElementById("form-login-message").innerHTML = response.data.message;

      // Si el login es exitoso, mostrar el mapa y ocultar el formulario
      if (username === "admin" && password === "admin") { // Asegúrate de que la respuesta tenga un campo 'success'
        document.querySelector(".container-interior-forms").style.display = "none"; // Ocultar el formulario
        document.getElementById("map-container").style.display = "block"; // Mostrar el mapa
        document.getElementById("user-info").innerText = `Usuario: ${username}`; // Mostrar el nombre del usuario
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      document.getElementById("form-login-message").innerHTML = error.message;
    })
    .finally(function () {
      // always executed
      console.log('Finally');
    });
}

export function logout() {
  axios.post(URL_API + '/appdesweb/app_logout/', {})
    .then(function (response) {
      // handle success
      console.log(response);
      document.getElementById("form-login-message").innerHTML = response.data.message;

      // Ocultar el mapa y mostrar el formulario de login
      document.getElementById("map-container").style.display = "none"; // Ocultar el mapa
      document.querySelector(".container-interior-forms").style.display = "block"; // Mostrar el formulario de login
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
      console.log('Finally');
    });
}

