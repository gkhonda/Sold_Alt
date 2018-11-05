// Imports do electron
const remote = require('electron').remote;
const {ipcRenderer} = require('electron');

// Variaveis para trabalhar com data -> já deixa setado os calendários na data atual (pesquisar venda do dia)
let now = new Date();
let day = ("0" + now.getDate()).slice(-2);
let month = ("0" + (now.getMonth() + 1)).slice(-2);
let today = now.getFullYear() + "-" + (month) + "-" + (day);
let y = now.getFullYear() + "-" + (month) + "-" + (day);
let id;

// Declarações jQuery -> acho mais organizados fazermos assim sempre, para não chamar os seletores várias vezes.
const datepicker1 = $("#datepicker1");
const datepicker2 = $("#datepicker2");
const btnPesquisa = $("#btn-pesquisa");
const inputSearch = $('#inputSearch');
const tableSearch = $("#tableSearch");
const clienteModal = $('#cliente-modal');
const valorModal = $("#valor-modal");
const modalTable = $(".modal-table");
const btnDelete = $("#btn-delete");
const btnChange = $("#btn-change");

// Seta as datas no calendario
datepicker1.val(y);
datepicker2.val(today);

$("#navbar").load("../html/navbar-seller.html");

// Pesquisa vendas -> data + nome (vazio pega tudo). Sem cpf por enquanto
btnPesquisa.on('click', function () {
    let data = {
        'name_or_cpf': inputSearch.val(),
        'initial_date': datepicker1.val(),
        'final_date': datepicker2.val(),
        'unique': false,
        'only_order': $('#order').prop('checked') ? $('#order').prop('checked') : null
    };
    $.get(remote.getGlobal('default_url') + "sale/read", data).done(function (back) {
        update_table(back['sale'])
    }).fail(function () {
        ipcRenderer.send('login',
            {
                'type': 'sad',
                'message': 'Erro de conexão.',
                'text': "Verifique a conexão com a Internet."
            })
    });
});

// Enche a tabela
let update_table = function (list_of_sales) {
    $("#tableSearch .plus-sale").remove();
    list_of_sales.slice().reverse().forEach(function (c) {
        tableSearch.append('<tr class="plus-sale"><td class="details-control"><img src="../../public/images/plus-icon.png">' + c.id + '</td><td>' + c.datetime.substring(0, 10) + " " + c.datetime.substring(11, 16) + '</td><td>' + c.client__cpf + '</td><td>' + c.client__name + '</td><td>' + c.value + '</td></tr>')
    })
};

// Se clica no maiszinho abre o modal com detalhes da venda, para ver se quer apagar mesmo (ou realizar a troca)
tableSearch.on('click', 'tr td img', function () {
    id = $(this).parent().text();
    let data = {
        'unique': true,
        'id': id
    };
    $.get(remote.getGlobal('default_url') + "sale/read", data).done(function (back) {
        let sale = back['sale'];
        let products_of_sale = back['products_of_sale'];
        $('#span-venda').text(id);
        clienteModal.text(sale.client__name);
        valorModal.text(sale.value);
        $(".modal-table tr").remove();
        products_of_sale.forEach(function (c) {
            modalTable.append('<tr><td>' + c.id + '</td><td>' + c.name + '</td><td>' + c.size + '</td><td>' + c.quantity + '</td></tr>')
        });
        $('.modal').css('display', 'block');
    }).fail(function () {
        console.log("fail")
    });
});

// Deleta a venda
btnDelete.on('click', function () {
    if (remote.getGlobal('is_admin')) {
        $.post(remote.getGlobal('default_url') + "sale/delete", {'id': id}).done(function (back) {
            if (back['status'] === "OK") {
                $('.modal').css('display', 'none');
                location.reload();
            } else {
                ipcRenderer.send('login',
                    {
                        'type': 'sad',
                        'message': 'Erro ao deletar a venda.',
                        'text': back['exception']
                    })
            }
        }).fail(function () {
            ipcRenderer.send('login',
                {
                    'type': 'sad',
                    'message': 'Erro de conexão.',
                    'text': "Verifique a conexão com a Internet."
                })
        })
    } else {
        ipcRenderer.send('login',
            {
                'type': 'ok-face',
                'message': 'Erro de permissão.',
                'text': "Você não tem permissão para isso. Peça para o administrador"
            })
    }
});

// TODO: Abre tela de troca
btnChange.on('click', function () {
    ipcRenderer.send('login',
        {
            'type': 'ok-face',
            'message': 'Não implementado.',
            'text': "Essa função ainda está sendo desenvolvida! Espere a próxima release."
        })
});

// Fecha o modal
$('.close').click(function () {
    $('.modal').css('display', 'none');
});
