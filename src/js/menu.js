require('electron-window').parseArgs();
const {getCurrentWindow} = require('electron').remote;
const {ipcRenderer} = require('electron');
let win;

// Para manipular a Janela Atual
win = getCurrentWindow();

$('#sale').on('click', function (e) {
    // Cria o get request para pegar os produtos
    $.get("http://127.0.0.1:8000/product/read").done(function (back) {
        console.log(back);
        if (back['Error'] === true) {
            ipcRenderer.send('login',
                {
                    'type': 'sad',
                    'message': 'Erro.',
                    'text': 'Não foi possível encontrar produtos no BD'
                });
        }
        else {
            back['url'] = 'src/html/sale.html';
            ipcRenderer.send('new-main-screen', back);
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
    if (navigator.onLine)
    {
        ipcRenderer.send('sangria', '');
    }
    else
    {
        ipcRenderer.send('login',
            {
                'type': 'sad',
                'message': 'Erro.',
                'text': 'Verifique a conexão'
            })
    }
});

$('#storage').on('click', function () {
    win.showURL('src/html/storage.html')
});

$('#search-sale').on('click', function () {
    if (navigator.onLine)
    {
        ipcRenderer.send('search-sale', '');
    }
    else
    {
        ipcRenderer.send('login',
            {
                'type': 'sad',
                'message': 'Erro.',
                'text': 'Verifique a conexão'
            })
    }
});

$('#reports-menu').on('click', function () {
    if (navigator.onLine)
    {
        win.showURL('src/html/reports_menu.html')
    }
    else
    {
        ipcRenderer.send('login',
            {
                'type': 'sad',
                'message': 'Erro.',
                'text': 'Verifique a conexão'
            })
    }
});

$('#log-out').on('click', function() {
    ipcRenderer.send('login',
    {
        'type' : 'happy',
        'message': 'Confirmação',
        'text': 'Deseja voltar para tela de login?',
        'confirmation': 'True'
    })
})