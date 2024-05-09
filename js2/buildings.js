import axios from 'axios';
export function muestraMensaje(){
    console.log('Soy el evento click del boton test');

    var n1 = Number(document.getElementById('username').value);
    var n2 = Number(document.getElementById('password').value);

    document.getElementById('result').value=n1+n2;
    document.getElementById('message').innerHTML="Message: Resultado = " + String(n1+n2)

    axios.get('http://localhost:8000/appdesweb/hello_world/')
    .then(function (response) {
    // handle success
    document.getElementById('message').innerHTML=response.data.message;
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
    console.log('Terminado');
  });


}

