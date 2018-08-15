const {BrowserWindow, getCurrentWindow} = require('electron').remote;

const path = require('path')
const url = require('url')

let win, new_win

// Para manipular a Janela Atual
win = getCurrentWindow()

const {ipcRenderer} = require('electron')

var prices = {
    cost: 0,
    sell: 0
};


function sendInfo() {
    var name = $('#name').val();
    var size = $('#size').val();
    var price_in = prices.cost / 100;
    var price_out = prices.sell / 100;
    if (name === '' || size === null || price_in === 0 || price_out === 0 || price_in > price_out) {
        if (name === '' || size === null || price_in === 0 || price_out === 0) {
            $('#sent').text('Preencha todos os campos');
        }
        else {
            $('#sent').text('O preço de custo não pode ser maior que o de venda')
        }
        if ($('#sent').hasClass('hasnt-error')) {
            $('#sent').removeClass('hasnt-error');
        }
        if (!$('#sent').hasClass('has-error')) {
            $('#sent').addClass('has-error');
        }
        if ($('#sent').css('display') === 'none') {
            $('#sent').fadeIn(100);
        }
    }
    else {
        $('#sent').text('Produto enviado com sucesso');
        if ($('#sent').hasClass('has-error')) {
            $('#sent').removeClass('has-error');
        }
        if (!$('#sent').hasClass('hasnt-error')) {
            $('#sent').addClass('hasnt-error');
        }
        if ($('#sent').css('display') === 'none') {
            $('#sent').fadeIn(100);
        }

        var data = {
            'name': name,
            'size': size,
            'price_cost': price_in,
            'price_sell': price_out
        }

        //send to back-end
        $.post("http://127.0.0.1:8000/product/create", data).done(function (back) {
            if (back['Error'] === true) {
                ipcRenderer.send('login',
                    {
                        'type': 'sad',
                        'message': "Já existe um produto com esse nome",
                        'text': 'Digite outro produto!'
                    })
                return
            }
            else if (back['Submitted'] === true) {
                ipcRenderer.send('login',
                    {
                        'type': 'happy',
                        'message': 'Produto Cadastrado com Sucesso!',
                        'text': 'Aperte Ok para fechar'
                    })
                return
            }
            else {
                win.showUrl('src/html/add_product.html', back)
            }
        }).fail(function () {
            ipcRenderer.send('login',
                {
                    'type': 'sad',
                    'message': 'Erro na comunicação com o servidor.',
                    'text': "Verifique sua conexão com a internet."
                })
        })
    }
}


$('.btn').on('click', function () {
    sendInfo();
})

$('.data').on('keypress', function (event) {
    if (event.which == 13) {
        sendInfo();
    }
})

$('.prices input').on('keyup', function (event) {
    if (event.which < 58 && event.which > 47 || event.which === 8) { //it's a number or backspace
        if ($(this).attr('id') === 'price_in') {
            var whichPrice = 'cost';
        }
        else {
            var whichPrice = 'sell';
        }
        if (event.which !== 8) { //not backspace
            var digit = Number(String.fromCharCode(event.which));
            prices[whichPrice] = prices[whichPrice] * 10 + digit;
        }
        else {
            prices[whichPrice] = prices[whichPrice] / 10 >> 0;
        }
        $(this).val('R$' + prices[whichPrice] / 100);
    }
    else if (event.which > 31 && event.which !== 127) { //printable chars
        var input = $(this).val();
        input = input.slice(0, -1);
        $(this).val(input);
    }
});

$('.data').on('click', function () {
    if ($('#sent').css('display') !== 'none') {
        $('#sent').fadeOut(100);
    }
})