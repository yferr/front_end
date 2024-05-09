import {login} from './login'

export function registerEvents(){
    document.getElementById('button-login').addEventListener('click',login)
}