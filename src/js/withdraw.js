const remote = require('electron').remote;
const {ipcRenderer} = require('electron');

let type = "Dinheiro";

// Formatar corretamente o valor para reais
let valor = "0";
$('#name').on('keyup change', function (e) {
    valor = formact(this, valor, e);
});

// Post request inicial para pegar a quantidade de dinheiro em caixa
$.post("http://127.0.0.1:8000/withdraw/read", {'method': 'Dinheiro', 'loja': remote.getGlobal('LojaNome')}).done(function (back) {
    $('#money-quantity').text(back['quantity'].toFixed(2));
});

// Mudar dinheiro/cheque
$('#change-type').click(function () {

    if (type === "Dinheiro") {
        $.post("http://127.0.0.1:8000/withdraw/read", {'method': 'Cheque', 'loja': remote.getGlobal('LojaNome')}).done(function (back) {
            console.log(back['quantity']);
            $('#money-quantity').text(back['quantity'].toFixed(2));
            $('.span-method').text("Cheque");
            type = "Cheque";
            $("#type-text").text("DINHEIRO");

        });
    } else {
        $.post("http://127.0.0.1:8000/withdraw/read", {'method': 'Dinheiro', 'loja': remote.getGlobal('LojaNome')}).done(function (back) {
            console.log(back['quantity']);
            $('#money-quantity').text(back['quantity'].toFixed(2));
            $('.span-method').text("Dinheiro");
            type = "Dinheiro";
            $("#type-text").text("CHEQUE");

        });
    }

});

// Fazer retirada de dinheiro
$('#make-withdraw').on('click', function () {
    if (remote.getGlobal('is_admin')) {
        let qnt = parseFloat(valor) / 100;
        if (parseFloat(qnt) > parseFloat($('#money-quantity').text())) {
            ipcRenderer.send('login', {
                'type': 'ok-face',
                'message': 'Operação não permitida.',
                'text': "Não se pode retirar um valor maior do que a quantidade atual."
            });
        } else {
            update_withdraw_database(1);
        }
    } else {
        ipcRenderer.send('login', {
            'type': 'sad',
            'message': 'Permissão negada.',
            'text': "Seu usuário não tem permissão para isso. Solicite para um administrador."
        });
    }
});

// Fazer depósito de dinheiro
$('#deposit').on('click', function () {
    update_withdraw_database(0);
});

function formact(element, valor, event) {

    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    });

    if (event.which < 58 && event.which > 47) {
        let last_typo = $(element).val()[$(element).val().length - 1];
        if (valor === undefined) {
            valor = $(element).val()
        } else {
            valor = valor + last_typo;
        }
    } else if (event.which === 8) {
        valor = $(element).val().replace(/\D/g, "");
    }

    if (valor.length > 0) {
        $(element).val((formatter.format((parseFloat(valor) / 100).toFixed(2))));
    } else {
        $(element).val(formatter.format(0));
    }

    return valor;
}

let update_withdraw_database = function (is_withdraw) {
    let qnt = (parseFloat(valor) / 100).toFixed(2);
    let user_id = remote.getGlobal('Vendedor_id');

    let args = {
        'type': type,
        'quantity': qnt,
        'user_id': user_id,
        'withdraw': is_withdraw,
        'loja': remote.getGlobal('LojaNome')
    };


    if (valor == 0 || valor === undefined || isNaN(valor)) {
        ipcRenderer.send('login', {
            'type': 'ok-face',
            'message': 'Preencha corretamente os campos.',
            'text': "Não esqueça de adicionar um valor não nulo."
        });
        return;
    }

    $.post("http://127.0.0.1:8000/withdraw/create", args).done(function (back) {
        if (back['Error'] === 1) {
            ipcRenderer.send('login',
                {
                    'type': 'sad',
                    'message': 'Erro.',
                    'text': 'Não foi possível realizar a venda.'
                });

        } else {
            ipcRenderer.send('login',
                {
                    'type': 'happy',
                    'message': 'Sucesso!',
                    'text': 'Operação feita com sucesso!'
                });
            // location.reload();
            reset();
        }
    }).fail(function () {
        ipcRenderer.send('login',
            {
                'type': 'sad',
                'message': 'Erro.',
                'text': 'Verifique a conexão'
            })
    });
};

let reset = function () {
    valor = 0;
    $.post("http://127.0.0.1:8000/withdraw/read", {'method': type, 'loja': remote.getGlobal('LojaNome')}).done(function (back) {
        $('#money-quantity').text(back['quantity'].toFixed(2));
    });
    $('#name').val('');
};