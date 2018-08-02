const remote = require('electron').remote;
const {ipcRenderer} = require('electron');

let type = "Dinheiro";
$.post("http://127.0.0.1:8000/withdraw/read", {'method': 'Dinheiro'}).done(function (back) {
    $('#money-quantity').text(back['quantity'].toFixed(2));
});


$('#change-type').click(function () {
    if (type === "Dinheiro") {
        $.post("http://127.0.0.1:8000/withdraw/read", {'method': 'Cheque'}).done(function (back) {
            console.log(back['quantity']);
            $('#money-quantity').text(back['quantity'].toFixed(2));
            $('.span-method').text("Cheque");
            type = "Cheque";
            $("#type-text").val("DINHEIRO");

        });
    } else {
        $.post("http://127.0.0.1:8000/withdraw/read", {'method': 'Dinheiro'}).done(function (back) {
            console.log(back['quantity']);
            $('#money-quantity').text(back['quantity'].toFixed(2));
            $('.span-method').text("Dinheiro");
            type = "Dinheiro";
            $("#type-text").val("CHEQUE");

        });
    }

});

$('#make-withdraw').on('click', function () {

    let qnt = parseFloat($('.form-control').val());
    let user_id = remote.getGlobal('Vendedor_id');
    let is_withdraw = true;

    let args = {
        'type': type,
        'quantity': qnt,
        'user_id': user_id,
        'withdraw': is_withdraw
    };

    $.post("http://127.0.0.1:8000/withdraw/create", args).done(function (back) {
        if (back['Error'] === true) {
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
                    'text': 'Retirada de dinheiro feita com sucesso cadastrada!'
                })
        }
    }).fail(function () {
        ipcRenderer.send('login',
            {
                'type': 'sad',
                'message': 'Erro.',
                'text': 'Verifique a conexão'
            })
    });

});