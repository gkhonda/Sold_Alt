const {getCurrentWindow} = require('electron').remote;
const {ipcRenderer} = require('electron');
const remote = require('electron').remote;

let win;

// Para manipular a Janela Atual
win = getCurrentWindow();

$("#navbar").load("../html/navbar-seller.html");

$('#sale').on('click', function (e) {
    // Cria o get request para pegar os produtos
    $.get(remote.getGlobal('default_url') + "product/read").done(function (back) {
        if (back['Error'] === true) {
            ipcRenderer.send('login',
                {
                    'type': 'sad',
                    'message': 'Erro.',
                    'text': 'Não foi possível encontrar produtos no BD'
                });
        }
        else {
            back['url'] = 'sale.html';
            ipcRenderer.send('new-sale', back);
        }
    }).fail(function () {
        ipcRenderer.send('login',
            {
                'type': 'sad',
                'message': 'Erro.',
                'text': 'Verifique a conexão'
            })
    })
});

$('#sangria').on('click', function () {
    if (navigator.onLine) {
        ipcRenderer.send('sangria', '');
    }
    else {
        ipcRenderer.send('login',
            {
                'type': 'sad',
                'message': 'Erro.',
                'text': 'Verifique a conexão'
            })
    }
});

$('#storage').on('click', function () {
    // Cria o get request para pegar os produtos
    $.get(remote.getGlobal('default_url') + "product/read").done(function (back) {
        if (back['Error'] === true) {
            ipcRenderer.send('login',
                {
                    'type': 'sad',
                    'message': 'Erro.',
                    'text': 'Não foi possível encontrar produtos no BD'
                });
        }
        else {
            back['url'] = 'storage_transfer.html';
            ipcRenderer.send('update-window', back)
        }
    }).fail(function () {
        ipcRenderer.send('login',
            {
                'type': 'sad',
                'message': 'Erro.',
                'text': 'Verifique a conexão'
            })
    });
    // ipcRenderer.send('login',
    //     {
    //         'type': 'ok-face',
    //         'message': 'Essa página não foi implementada ainda.',
    //         'text': 'Espere a próxima atualização.'
    //     });
});

$('#search-sale').on('click', function () {
    if (navigator.onLine) {
        ipcRenderer.send('update-window', {'url': 'search_sale.html'})
    } else {
        ipcRenderer.send('login',
            {
                'type': 'sad',
                'message': 'Erro.',
                'text': 'Verifique a conexão'
            })
    }
});

$('#reports-menu').on('click', function () {
    if (navigator.onLine) {
        ipcRenderer.send('update-window', {'url': 'reports_menu.html'});

    }
    else {
        ipcRenderer.send('login',
            {
                'type': 'sad',
                'message': 'Erro.',
                'text': 'Verifique a conexão'
            })
    }
});

$('#log-out').on('click', function () {
    ipcRenderer.send('login',
        {
            'type': 'happy',
            'message': 'Confirmação',
            'text': 'Deseja voltar para tela de login?',
            'confirmation': 'True'
        })
})

var user = remote.getGlobal('Vendedor');
var headerText = "Bem Vinda/o " + user + "!";
$('#user').text(headerText);