const {ipcRenderer} = require('electron');
const {getCurrentWindow} = require('electron').remote;

$(".sale").on('click', function () {
    ipcRenderer.send('menu', {'url': 'src/html/menu.html'});
    window = getCurrentWindow();
    window.close()
});

$(".admin").on('click', function () {
    $.get('http://127.0.0.1:8000/sale/return_infos', {'loja': ""}).done(function (back) {
        back['url'] = 'src/html/dashboard.html';
        ipcRenderer.send('new-main-screen', back)
        window = getCurrentWindow();
        window.close()
    }).fail(function (err) {
        ipcRenderer.send('login',
            {
                'type': 'ok-face',
                'message': 'Erro',
                'text': 'Verifique sua conexao!'
            });
    });
});