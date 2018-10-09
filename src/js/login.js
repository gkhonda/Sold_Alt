// import { ipcRenderer } from 'electron';
// This is the renderer
const {getCurrentWindow} = require('electron').remote;
const remote = require('electron').remote;
let hash = window.location.hash.slice(1);
window.__args__ = Object.freeze(JSON.parse(decodeURIComponent(hash)));

let win;

// Para manipular a Janela Atual
win = getCurrentWindow();

const {ipcRenderer} = require('electron');

const btnLogin = $("#btnLogin");

// Essa função é chamada ao clicar no botao
var login = function () {
    // Remove as classes de erro - caso elas estejam lá ainda.
    $('#helpBlock').remove();
    $('div').removeClass('has-error');

    // Cria um objeto com os dados do forms
    var data = $('#form').serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    // Verifica se alguns do campo são nulos -> se sim, nem envia, apenas cria aviso.

    if (!data['name']) {
        $('#div-user').addClass('has-error');
        $('#div-user').append('<span id="helpBlock" class="help-block">Preencha o usuário.</span>');

        return
    }

    if (!data['password']) {
        $('#div-password').addClass('has-error');
        $('#div-password').append('<span id="helpBlock" class="help-block">Preencha a senha.</span>');
        return
    }

    // Cria um post request pro endereço (local), que ta rodando o meu Django
    btnLogin.addClass("disabled");
    $.post(remote.getGlobal('default_url') + "login/", data).done(function (back) {
            if (back['isAuth'] === false) {
                ipcRenderer.send('login',
                    {
                        'type': 'sad',
                        'message': 'Acesso negado',
                        'text': "Usuário ou senha incorretos"
                    })
            } else if (back['Permission'] === "Administrador") {
                back['url'] = 'menu_adm.html';
                ipcRenderer.send('menu_admin', back);
                win.close()
            } else {
                ipcRenderer.send('menu_not_admin', back);
                back['url'] = 'menu.html';
                ipcRenderer.send('update-window', back);
            }
        }
        // Lida com erro no request
    ).fail(function () {
            ipcRenderer.send('login',
                {
                    'type': 'sad',
                    'message': 'Erro na comunicação com o servidor.',
                    'text': "Verifique sua conexão com a internet."
                })
        }
        // Limpa o campo password para o user tentar novamente
    ).always(function () {
        $('#password').val('')
        $('#btnLogin').removeClass("disabled");
    });
};

// Chama quando clica
btnLogin.on("click", function () {
    if(!$(this).hasClass("disabled")) {
        login()
    }
});

// Chama quando aperta enter
$(".form-control").keypress(function (event) {
    if (event.which === 13 && !btnLogin.hasClass("disabled")) {
        login();
    }
});
