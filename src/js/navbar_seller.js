const {ipcRenderer} = require('electron');
const remote = require('electron').remote;
const {getCurrentWindow} = require('electron').remote;

// Para manipular a Janela Atual
let win = getCurrentWindow();
// JQuery selectors
const navbar = $('#navbar');

$('#nav-img').click(function () {
    $('.total').toggleClass('block');
    $('.vertical-menu').toggleClass('open_drawer');
});

$(document).click(function (event) {
    //if you click on anything except the modal itself or the "open modal" link, close the modal
    if (!$(event.target).closest(".vertical-menu, #nav-img").length) {
        $("body").find(".total").removeClass("block");
        $('.vertical-menu').removeClass('open_drawer');
    }
});

navbar.on('click', '.total .vertical-menu .border-orange .btn-group #menu', function (e) {
    // Cria o get request para pegar os produtos
    win.showURL('src/html/menu.html')
});

navbar.on('click', '.total .vertical-menu .border-orange .btn-group #withdraw', function () {
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

navbar.on('click', '.total .vertical-menu .border-orange .btn-group #storage', function () {
    ipcRenderer.send('login',
        {
            'type': 'ok-face',
            'message': 'Essa página não foi implementada ainda.',
            'text': 'Espere a próxima atualização.'
        });
});

navbar.on('click', '.total .vertical-menu .border-orange .btn-group #search-sale', function () {
    if (navigator.onLine) {
        win.showURL('src/html/search_sale.html')
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

navbar.on('click', '.total .vertical-menu .border-orange .btn-group #reports-menu', function () {
    if (navigator.onLine) {
        win.showURL('src/html/reports_menu.html', {'from': 'seller'})
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

navbar.on('click', '.total .vertical-menu .border-orange .btn-group #sair', function () {
    ipcRenderer.send('login',
        {
            'type': 'happy',
            'message': 'Confirmação',
            'text': 'Deseja voltar para tela de login?',
            'confirmation': 'True'
        })
});