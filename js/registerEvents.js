import {login} from './login';
import { insert } from './buildings';

export function registerEvents(){
    document.getElementById('button-login').addEventListener('click',login);
    document.getElementById('form-building-insert').addEventListener('click',insert);
}