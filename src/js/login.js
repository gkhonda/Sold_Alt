// import { ipcRenderer } from 'electron';

// This is the renderer

<<<<<<< HEAD
const {BrowserWindow, getCurrentWindow} = require('electron').remote
=======
const { ipcRenderer, remote } = require('electron')
>>>>>>> 032e547d080d8592001500057dd51e1a0f221354

const path = require('path')
const url = require('url')

const winAlert = require('../../mainAlert')

// const modalWindow = require('./modalWindow')

<<<<<<< HEAD
let win, new_win

// Para manipular a Janela Atual
win = getCurrentWindow()
=======
// Send message to main process on channel login
>>>>>>> 032e547d080d8592001500057dd51e1a0f221354

const {ipcRenderer} = require('electron')

<<<<<<< HEAD
// Send message to main process on channel login

// Essa função é chamada ao clicar no botao
var login = function() {
    // Remove as classes de erro - caso elas estejam lá ainda.
    $('#helpBlock').remove()
    $('div').removeClass('has-error')
    
    // Cria um objeto com os dados do forms
    var data = $('#form').serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    // Verifica se alguns do campo são nulos -> se sim, nem envia, apenas cria aviso.

    if (!data['name']){
        $('#div-user').addClass('has-error')
        $('#div-user').append('<span id="helpBlock" class="help-block">Preencha o usuário.</span>')

        return
    }
    
    if (!data['password']){
        $('#div-password').addClass('has-error')
        $('#div-password').append('<span id="helpBlock" class="help-block">Preencha a senha.</span>')
        return
    }

    // Cria um post request pro endereço (local), que ta rodando o meu Django
    $.post( "http://127.0.0.1:8000/login/", data).done(function(back) {
        
        if(back['isAuth'] == false) {
            ipcRenderer.send('login', 
            {'type' : 'sad', 
            'message' : 'Acesso negado',
            'text' : "Usuário ou senha incorretos"})
        } else if (back['Permission'] == "Administrador") {
            console.log('hey')
            ipcRenderer.send('menu_admin', {'s':'s'})
        } else {
            win.showUrl('src/html/login.html', back, () => {
                console.log('window is now visible!')
              })
        }
    }
    // Lida com erro no request
    ).fail(function (){
        ipcRenderer.send('login', 
                {'type' : 'sad', 
                'message' : 'Erro na comunicação com o servidor.',
                'text' : "Verifique sua conexão com a internet."})
        }
    // Limpa o campo password para o user tentar novamente
    ).always(function (){
        $('#password').val('')
    });
}

// Chama quando clica
$("#btnLogin").on("click", function (e) {
    login()
})

// Chama quando aperta enter
$(".form-control").keypress(function(event) {
    if (event.which == 13) login();
});


=======
// Expect the response from the main process
ipcRenderer.on('toLogin', (e, args) => {
  console.log(args)
})

// Essa função é chamada ao clicar no botao
$("#btnLogin").on("click", function (e)
{
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
        pathname: path.join(__dirname, '../html/login.html'),
        protocol: 'file:',
        slashes: true
      })))
    }
  });
})
>>>>>>> 032e547d080d8592001500057dd51e1a0f221354
