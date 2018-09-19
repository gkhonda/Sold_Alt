const {getCurrentWindow} = require('electron').remote;
const {ipcRenderer} = require('electron');
const remote = require('electron').remote;

// Para manipular a Janela Atual
let win = getCurrentWindow();
const sent = $('#sent');
let prices = {
    cost: 0,
    sell: 0
};

// Include navbar
$(function () {
    $("#navbar").load("../html/navbar_adm.html");
});

function sendInfo() {
    let name = $('#name').val();
    let size = $('#size').val();
    let price_in = prices.cost / 100;
    let price_out = prices.sell / 100;
    if (name === '' || size === null || price_in === 0 || price_out === 0 || price_in > price_out) {
        if (name === '' || size === null || price_in === 0 || price_out === 0) {
            sent.text('Preencha todos os campos');
        }
        else {
            sent.text('O preço de custo não pode ser maior que o de venda')
        }
        if (sent.hasClass('hasnt-error')) {
            sent.removeClass('hasnt-error');
        }
        if (!sent.hasClass('has-error')) {
            sent.addClass('has-error');
        }
        if (sent.css('display') === 'none') {
            sent.fadeIn(100);
        }
    }
    else {
        sent.text('Produto enviado com sucesso');
        if (sent.hasClass('has-error')) {
            sent.removeClass('has-error');
        }
        if (!sent.hasClass('hasnt-error')) {
            sent.addClass('hasnt-error');
        }
        if (sent.css('display') === 'none') {
            sent.fadeIn(100);
        }

        let data = {
            'name': name,
            'size': size,
            'price_cost': price_in,
            'price_sell': price_out
        };

        //send to back-end
        $.post(remote.getGlobal('default_url') + "product/create", data).done(function (back) {
            if (back['Error'] === true) {
                ipcRenderer.send('login',
                    {
                        'type': 'sad',
                        'message': "Já existe um produto com esse nome",
                        'text': 'Digite outro produto!'
                    });
            }
            else if (back['Submitted'] === true) {
                ipcRenderer.send('login',
                    {
                        'type': 'happy',
                        'message': 'Produto Cadastrado com Sucesso!',
                        'text': 'Aperte Ok para fechar'
                    });
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
});

$('.data').on('keypress', function (event) {
    if (event.which == 13) {
        sendInfo();
    }
});

$('.prices input').on('keyup', function (event) {
    if (event.which < 58 && event.which > 47 || event.which === 8) { //it's a number or backspace
        let whichPrice;
        if ($(this).attr('id') === 'price_in') {
            whichPrice = 'cost';
        }
        else {
            whichPrice = 'sell';
        }
        if (event.which !== 8) { //not backspace
            let digit = Number(String.fromCharCode(event.which));
            prices[whichPrice] = prices[whichPrice] * 10 + digit;
        }
        else {
            prices[whichPrice] = prices[whichPrice] / 10 >> 0;
        }
        $(this).val('R$' + prices[whichPrice] / 100);
    }
    else if (event.which > 31 && event.which !== 127) { //printable chars
        let input = $(this).val();
        input = input.slice(0, -1);
        $(this).val(input);
    }
});

$('.data').on('click', function () {
    if (sent.css('display') !== 'none') {
        sent.fadeOut(100);
    }
});