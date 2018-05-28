// import { ipcRenderer } from 'electron';

// This is the renderer

const {BrowserWindow, getCurrentWindow} = require('electron').remote

const path = require('path')
const url = require('url')

let win, new_win

// Para manipular a Janela Atual
win = getCurrentWindow()

const {ipcRenderer} = require('electron')

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


