require('electron-window').parseArgs();
const {getCurrentWindow} = require('electron').remote;
const {ipcRenderer} = require('electron');

let win;

const remote = require('electron').remote;

// Para manipular a Janela Atual
win = getCurrentWindow();
// Variaveis auxiliares
let to_pay;
let received = 0;
let to_receive;
let change = 0;

// Página superior

// Lista de names
let list_of_products = window.__args__['Product'];

let product_dictionary = {};
let current_sale = {};

// Coloca os names na tabela
list_of_products.forEach(function (p) {
    $('.search-table').append('<tr class="table-search"><td>' + p.id + '</td><td>' + p.name + '</td><td>' + p.size + '</td><td>' + p.price_sell + '</td></tr>');
    product_dictionary[p.id] = p
});

// Faz o painel ser preenchido
let update_div = function (product) {
    $('#productId').val(product.id);
    $('#productDesc').text(product.name + ' ' + product.size);
};

$('.add-client').click(function () {
    $('#myModal').css('display', 'block');
});

// Apaga name da compra
$("#saleTable").on('click', "tr td .del", function (e) {
    // Pega o código e deleta ele
    delete current_sale[$(this).parent().html()[$(this).parent().html().length - 1]];
    $(this).parent().parent().remove();
    e.stopPropagation();
    atualiza_venda(5)
});

// Funções para o botão de diminui/aumenta a quantidade 
$('.btn-success').click(function (e) {
    // Stop acting like a button
    e.preventDefault();
    // Get the field name
    var quantity = parseInt($('.quantity').val());
    // If is not undefined
    $('.quantity').val(quantity + 1);
    // Increment
});

// Diminui
$('.btn-danger').click(function (e) {
    // Stop acting like a button
    e.preventDefault();
    // Get the field name
    var quantity = parseInt($('.quantity').val());
    // If is not undefined
    // Increment
    if (quantity > 1) {
        $('.quantity').val(quantity - 1);
    }
});

// Pega da tabela
$('.table-search').on('click', function (e) {
    var product = [];
    $(this).find('td').each(function () {
        product.push($(this).html())
    });
    update_div(product_dictionary[product[0]]);
    e.preventDefault();
});

// Procura na tabela
$("#inputSearch").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#tableSearch tr").filter(function (e) {
        if (e !== 0) {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        }
    });
});

// Adiciona item (click)
$("#btnAdd").on("click", function () {
    add_item();
});

// Adiciona item (enter)
$("#productId").on("keyup", function (e) {
    if (e.which === 13) add_item();
    if (product_dictionary[$(this).val()] !== undefined) {
        update_div(product_dictionary[$(this).val()])
    }

});

// Atualiza preço total da venda, no valor final da tabela
var atualiza_venda = function (table_lenght) {
    var price = 0;
    $("#saleTable").find('tr').each(function () {
        $(this).find('td').each(function (index) {
            if (index === table_lenght - 1) {
                price += parseFloat($(this).html())
            }
        })
    });

    $('#totalValueSale').text((price).toFixed(2));

};

// Função que adiciona o item.
var add_item = function () {
    var id = $('#productId').val();
    var qnt = parseInt($('.quantity').val());

    if (product_dictionary[id] !== undefined) {

        if (current_sale[id] !== undefined) {
            current_sale[id] += qnt;
        } else {
            current_sale[id] = qnt;
        }

        $("#saleTable tr").remove();

        for (id in current_sale) {
            var p = product_dictionary[id];
            $('#saleTable').append('<tr><td><span class="del"><i class="fas fa-trash-alt"></i></span>' + id + '</td>' +
                '<td class="text"><span class="text-el">' + p.name + '</span></td>' +
                '<td>' + p.size + '</td>' +
                '<td>' + current_sale[id] + '</td>' +
                '<td>' + (p.price_sell * current_sale[id]).toFixed(2) + '</td></tr>');

            atualiza_venda(5);

            $('.quantity').val(1);
        }

    } else {
        alert("Verifique se o id é válido");
    }
};

// Finaliza de adicionar os itens (parte de cima), e move para o pagamento
$('.finish-sale').on('click', function () {

    to_pay = parseFloat($('#totalValueSale').text());

    if (to_pay !== 0){
        var name;
        var qnt;
        var price;

        tabela = {};

        venda = {
            'Total': $('#totalValueSale').text(),
            'Vendedor': remote.getGlobal('Vendedor_id'),
            'Cliente': $('#span-id-customer').text(),
            'LojaNome': remote.getGlobal('LojaNome')
        };

        // to_pay = parseFloat($('#totalValueSale').text());
        $("#to-pay").text(to_pay.toFixed(2));
        // received = 0;
        to_receive = to_pay - received;
        change = 0;
        $("#to-receive").text(to_receive.toFixed(2));

        go_end();

        
    } else {
        ipcRenderer.send('login',
            {
                'type': 'ok-face',
                'message': 'Insira produtos!',
                'text': 'Insira pelo menos algum produto para continuar com a venda.'
            });
    }

});

// Aqui começa a parte de baixo

// Inicia com dinheiro como método de pagamente
let payment_method = 'Dinheiro';

let dict_of_values = {
    'Dinheiro': 1,
    'Cheque': 2,
    'Débito': 3,
    'Crédito': 4,
    'Transferência': 5
};

current_payment = {};

let add_payment = function () {

    let tipo = dict_of_values[payment_method];
    let price_sell = parseFloat($("#lblQuantidade").val());

    if (price_sell === price_sell) {

        if (current_payment[payment_method] !== undefined) {
            current_payment[payment_method] += price_sell;
        } else {
            current_payment[payment_method] = price_sell;
        }

        $("#paymentTable tr").remove();

        for (let payment_method in current_payment) {

            $('#paymentTable').append('<tr><td><span class="del"><i class="fas fa-trash-alt"></i></span>' + dict_of_values[payment_method] + '</td>' +
                '<td>' + payment_method + '</td>' +
                '<td>' + (current_payment[payment_method]).toFixed(2) + '</td></tr>');

        }

        received += price_sell;
        to_receive = to_pay - received;

        if (to_receive < 0) {
            change = -to_receive;
            to_receive = 0;
        }

        $('#received').text(received.toFixed(2));
        $('#to-receive').text(to_receive.toFixed(2));
        $('#change').text(change.toFixed(2));

        if (received >= to_pay) {
            $('#red').removeClass("red");
            $('#red').addClass("green")
        } else {
            $('#red').removeClass("green");
            $('#red').addClass("red")
        }

        $('#totalValuePayment').text((received).toFixed(2))
    }
};

$("#paymentTable").on('click', "tr td .del", function (e) {

    // Pega o código e deleta ele
    var to_delete = get_from_table($(this).parent().parent().parent(), 1);
    delete current_payment[to_delete];
    $(this).parent().parent().remove();

    $("#paymentTable tr").remove();

    received = 0;

    for (payment_method in current_payment) {

        $('#paymentTable').append('<tr><td><span class="del"><i class="fas fa-trash-alt"></i></span>' + dict_of_values[payment_method] + '</td>' +
            '<td>' + payment_method + '</td>' +
            '<td>' + current_payment[payment_method].toFixed(2) + '</td></tr>');

        received += current_payment[payment_method];

    }

    to_receive = to_pay - received;

    if (to_receive < 0) {
        change = -to_receive;
        to_receive = 0;
    }

    $('#received').text(received.toFixed(2));
    $('#to-receive').text(to_receive.toFixed(2));
    $('#change').text(change.toFixed(2));

    $('#totalValuePayment').text(received.toFixed(2))

    e.stopPropagation();
});


$(".btn-toolbar .btn").click(function () {
    $('.btn').removeClass('active');
    $(this).addClass('active');
    payment_method = $(this).attr('id');
});


$("#add-payment").on('click', function (e) {
    add_payment();
    $("#lblQuantidade").val('');
});

$("#lblQuantidade").keypress(function (event) {
    if (event.which == 13) {
        add_payment();
        $("#lblQuantidade").val('')
    }
});

$('#back-sale').click(function () {
   back_start();
});

$('#end-sale').click(function () {
    if (to_receive !== 0) {
        ipcRenderer.send('login',
            {
                'type': 'ok-face',
                'message': 'Termine a venda!',
                'text': 'Adicione as formas de pagamento para o valor total da venda'
            });

    } else {
        send = {
            'sale_details': venda,
            'sale_itens': current_sale,
            'sale_payments': current_payment
        };
        $.post("http://127.0.0.1:8000/sale/create", JSON.stringify(send)
        ).done(function (back) {
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
                        'text': 'Venda cadastrada!'
                    });

                ipcRenderer.send('pdf', back['SaleId']);

                reset_sell();
                back_start();
            }
        }).fail(function () {
            ipcRenderer.send('login',
                {
                    'type': 'sad',
                    'message': 'Erro.',
                    'text': 'Verifique a conexão'
                })
        })
    }
});

//  Aqui começa a parte do Modal : consultar cliente

var update_table = function (list_of_clients) {
    $("#customerTable tr").remove();
    list_of_clients.forEach(function (c) {
        $('#customerTable').append('<tr class="table-search"><td>' + c.id + '</td><td>' + c.name + '</td><td>' + c.cpf + '</td></tr>')
    })
};

$('.close').click(function () {
    $('#myModal').css('display', 'none');
});

$("#btnRead").on("click", function () {
    let client = {};
    client['id'] = $('.selected').find('td:eq(0)').text();
    client['name'] = $('.selected').find('td:eq(1)').text();

    if (client.id === "") {
        ipcRenderer.send('login',
            {
                'type': 'ok-face',
                'message': 'Cuidado',
                'text': "Não esqueça de selecionar um cliente na tabela"
            })
    } else {
        $('#span-id-customer').text(client.id);
        $('#spam-name-customer').text(client.name);
        $('#myModal').css('display', 'none');

    }

});

$("#btnAddNewCustomer").on("click", function (e) {
    ipcRenderer.send('new-client', '')
});

// Colore a tabela com o elemente clickado
$("#client-table").on('click', 'tr', function () {
    $(this).addClass("selected").siblings().removeClass("selected");
});


// Formata cpf
$("#inputSearch-client").keyup(function () {
    if ($('#inputSearch-client').val().length > 2) {
        client_read("Read")
    }

});

var client_read = function (button) {

    // cria objeto com os dados do form
    var data = {};
    data['cpf'] = $('#inputSearch-client').val();

    // Cria o get request para pegar o cliente
    $.get("http://127.0.0.1:8000/client/read", data).done(function (back) {
        if (back['Error'] === true) {

        } else if (back['Exists'] === true) {
            if (button === "Read") {
                update_table(back['Clients']);

            } else if (button === "Update") {
                win.showUrl('src/html/client_update.html', back);

            }
        } else {
            win.showUrl('src/html/client_read.html', back);

        }
    }).fail(function () {
        ipcRenderer.send('login',
            {
                'type': 'sad',
                'message': 'Erro na comunicação com o servidor.',
                'text': "Verifique sua conexão com a internet."
            });
    });
};

var reset_sell = function () {
    to_receive = 0;
    received = 0;
    change = 0;
    $('#to-receive').text('0.00');
    $('#received').text('0.00');
    $('#change').text('0.00');
    $('#paymentTable tr').remove();
    $('#totalValuePayment').text('0.00');
    $('#saleTable tr').remove();
    $('#totalValueSale').text('0.00');
    current_sale = {};
    current_payment = {};
};

var back_start = function () {
    $('html,body').animate({
        scrollTop: $(".first-page").offset().top
    },
    'slow');
};

var go_end = function() {
   $('html,body').animate({
                scrollTop: $(".second-page").offset().top
    },
    'slow'); 
};

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function get_from_table(line, key) {
    let to_return;
    line.find('td').each(function (index) {
        if (index === key) {
            to_return =  $(this).html()
        }
    });

    return to_return;
}