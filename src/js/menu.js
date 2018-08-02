require('electron-window').parseArgs()
const {BrowserWindow, getCurrentWindow} = require('electron').remote;
const {ipcRenderer} = require('electron');

let win;

// Para manipular a Janela Atual
win = getCurrentWindow();

console.log(window.__args__);

$('#sale').on('click', function (e) {
    // Cria o get request para pegar os produtos
    $.get("http://127.0.0.1:8000/product/read").done(function (back) {
        if (back['Error'] === true) {
            ipcRenderer.send('login',
                {
                    'type': 'sad',
                    'message': 'Erro.',
                    'text': 'Não foi possível encontrar produtos no BD'
                });
        }
        else {
            win.showUrl('src/html/sale.html', back)
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
    ipcRenderer.send('sangria', '');
    // win.showUrl('src/html/withdraw.html', {});
});