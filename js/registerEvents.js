import {login, logout} from './login';
import { insert, select } from './buildings';

export function registerEvents(){
    document.getElementById('button-login').addEventListener('click',login);
    document.getElementById('button-logout').addEventListener('click',logout);
    document.getElementById('form-building-insert').addEventListener('click',insert);
    document.getElementById('form-building-select').addEventListener('click',select);

}