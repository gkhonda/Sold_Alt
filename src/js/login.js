// import { ipcRenderer } from 'electron';

// This is the renderer

const { ipcRenderer, remote } = require('electron')

const path = require('path')
const url = require('url')

// const request = net.request({
//     method: 'POST',
//     protocol: 'http:',
//     hostname: '127.0.0.1:8000',
//     port: 443,
//     path: '/'
//   })

let win

const {ipcRenderer} = require('electron')

// Send message to main process on channel login

ipcRenderer.send('login', "Helloooooooooo main.js")

// Expect the response from the main process
ipcRenderer.on('toLogin', (e, args) => {
    console.log(args)
})

// Essa função é chamada ao clicar no botao
$("#btnLogin").on("click", function (e) {

    // Para manipular a Janela Atual
    win = remote.getCurrentWindow()
    // Cria um objeto com os dados do forms
    var data = $('#form').serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    // Cria um post request pro endereço (local), que ta rodando o meu Django
    $.post( "http://127.0.0.1:8000/login/", data).done(function(back) {
        console.log(back)
        if(back['isAuth'] == false) {
            console.log("Not Auth babyyyyyy")
        } else if (back['Permission'] == "Administrador") {
            win.loadURL((url.format({
                    pathname: path.join(__dirname, '../html/menu.html'),
                    protocol: 'file:',
                    slashes: true
                })))
        } else {
            win.loadURL((url.format({
                pathname: path.join(__dirname, './login.html'),
                protocol: 'file:',
                slashes: true
            })))
        }
    }
);



})
