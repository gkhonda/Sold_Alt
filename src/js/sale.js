const {getCurrentWindow} = require('electron').remote;
const {ipcRenderer} = require('electron');

let hash = window.location.hash.slice(1);
window.__args__ = Object.freeze(JSON.parse(decodeURIComponent(hash)));

let win;

const remote = require('electron').remote;

// Para manipular a Janela Atual
win = getCurrentWindow();
// letiaveis auxiliares
let to_pay;
let received = 0;
let to_receive;
let change = 0;
let discount = 0;
// Página superior

// Lista de names
let list_of_products = window.__args__['Product'];

let product_dictionary = {};
let current_sale = {};

const productId = $("#productId");
const inpQnt = $('.quantity');
const totalValueSale = $('#totalValueSale');
const red = $('#red');


productId.val(list_of_products[0].id);
$('#productDesc').text(list_of_products[0].name + ' ' + list_of_products[0].size);

// Coloca os names na tabela
list_of_products.forEach(function (p) {
    $('.search-table').append('<tr class="table-search"><td>' + p.id + '</td><td>' + p.name + '</td><td>' + p.size + '</td><td>' + p.price_sell + '</td></tr>');
    product_dictionary[p.id] = p
});

// Faz o painel ser preenchido
let update_div = function (product) {
    productId.val(product.id);
    $('#productDesc').text(product.name + ' ' + product.size);
};

$('.add-client').click(function () {
    $('#myModal').css('display', 'block');
});

$('#desconto').click(function () {
    $('#myModal2').css('display', 'block');
});

// Apaga name da compra
$("#saleTable").on('click', "tr td .del", function (e) {
    // Pega o código e deleta ele
    delete current_sale[$("#saleTable tr td:first").text()];
    $(this).parent().parent().remove();
    e.stopPropagation();
    atualiza_venda(5)
});

// Funções para o botão de diminui/aumenta a quantidade
$('.btn-success').click(function (e) {
    // Stop acting like a button
    e.preventDefault();
    // Get the field name
    let quantity = parseInt(inpQnt.val());
    // If is not undefined
    inpQnt.val(quantity + 1);
    // Increment
});

// Diminui
$('.btn-danger').click(function (e) {
    // Stop acting like a button
    e.preventDefault();
    // Get the field name
    let quantity = parseInt(inpQnt.val());
    // If is not undefined
    // Increment
    if (quantity > 1) {
        inpQnt.val(quantity - 1);
    }
});

// Pega da tabela
$('.table-search').on('click', function (e) {
    let product = [];
    $(this).find('td').each(function () {
        product.push($(this).html())
    });
    update_div(product_dictionary[product[0]]);
    e.preventDefault();
});

// Procura na tabela
$("#inputSearch").on("keyup", function () {
    let value = $(this).val().toLowerCase();
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
productId.on("keyup", function (e) {
    if (e.which === 13) add_item();
    if (product_dictionary[$(this).val()] !== undefined) {
        update_div(product_dictionary[$(this).val()])
    }

});

// Atualiza preço total da venda, no valor final da tabela
let atualiza_venda = function (table_lenght) {
    let price = 0;
    $("#saleTable").find('tr').each(function () {
        $(this).find('td').each(function (index) {
            if (index === table_lenght - 1) {
                price += parseFloat($(this).html())
            }
        })
    });

    totalValueSale.text((price).toFixed(2));

};

// Função que adiciona o item.
let add_item = function () {
    let id = productId.val();
    let qnt = parseInt(inpQnt.val());

    if (product_dictionary[id] !== undefined) {

        if (current_sale[id] !== undefined) {
            current_sale[id] += qnt;
        } else {
            current_sale[id] = qnt;
        }

        $("#saleTable tr").remove();

        for (id in current_sale) {
            let p = product_dictionary[id];
            $('#saleTable').append('<tr><td><span class="del"><i class="fas fa-trash-alt"></i></span>' + id + '</td>' +
                '<td class="text"><span class="text-el">' + p.name + '</span></td>' +
                '<td>' + p.size + '</td>' +
                '<td>' + current_sale[id] + '</td>' +
                '<td>' + (p.price_sell * current_sale[id]).toFixed(2) + '</td></tr>');

            atualiza_venda(5);

            inpQnt.val(1);
        }

    } else {
        alert("Verifique se o id é válido");
    }
};

// Finaliza de adicionar os itens (parte de cima), e move para o pagamento
$('.finish-sale').on('click', function () {

    to_pay = parseFloat(totalValueSale.text());

    if (to_pay !== 0) {
        let name;
        let qnt;
        let price;

        tabela = {};

        venda = {
            'Total': totalValueSale.text(),
            'Vendedor': remote.getGlobal('Vendedor_id'),
            'Cliente': $('#span-id-customer').text(),
            'LojaNome': remote.getGlobal('LojaNome')
        };

        // to_pay = parseFloat(totalValueSale.text());
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
installment = 1;

let add_payment = function () {

    let tipo = dict_of_values[payment_method];
    let price_sell = parseFloat($("#lblValor").val());
    if (payment_method === 'Cheque') {
        installment = parseFloat($("#lblParcelas").val());
    }

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
            red.removeClass("red");
            red.addClass("green")
        } else {
            red.removeClass("green");
            red.addClass("red")
        }

        $('#totalValuePayment').text((received).toFixed(2))
    }
};

$("#paymentTable").on('click', "tr td .del", function (e) {

    // Pega o código e deleta ele
    let to_delete = get_from_table($(this).parent().parent().parent(), 1);
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
    if (payment_method === 'Cheque') {
        $('<input type="text" class="form-control" id="lblParcelas" placeholder="Parcelas">').appendTo('#paymentMethod');
        return false;
    }
    else {
        $('input').remove('#lblParcelas');
        return false;
    }
});


$("#add-payment").on('click', function (e) {
    add_payment();
    $("#lblValor").val('');
    $("#lblParcelas").val('');
});

$("#lblValor").keypress(function (event) {
    if (event.which == 13) {
        add_payment();
        $("#lblValor").val('')
        $("#lblParcelas").val('');
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
        let send = {
            'sale_details': venda,
            'sale_itens': current_sale,
            'sale_payments': current_payment,
            'installment': installment
        };
        send['discount'] = discount;
        send['change'] = change;
        $.post(remote.getGlobal('default_url') + "sale/create", JSON.stringify(send)
        ).done(function (back) {
            if (back['Online'] === false) {
                ipcRenderer.send('login',
                    {
                        'type': 'sad',
                        'message': 'Erro.',
                        'text': 'Problemas na conexão, a venda será guardada para processar depois.'
                    })
            }
            else if (back['Error'] === true) {
                ipcRenderer.send('login',
                    {
                        'type': 'sad',
                        'message': 'Erro.',
                        'text': 'Não foi possível realizar a venda.'
                    });

            } else {
                send['url'] = 'tax_cupom.html';
                send['productList'] = list_of_products;
                send['client'] = $('#spam-name-customer').text();
                ipcRenderer.send('pdf', send);
                console.log(send);

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

let update_table = function (list_of_clients) {
    $("#customerTable tr").remove();
    list_of_clients.forEach(function (c) {
        $('#customerTable').append('<tr class="table-search"><td>' + c.id + '</td><td>' + c.name + '</td><td>' + c.cpf + '</td></tr>')
    })
};

$('.close').click(function () {
    $('#myModal').css('display', 'none');
    $('#myModal2').css('display', 'block');
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

let client_read = function (button) {

    // cria objeto com os dados do form
    let data = {};
    data['cpf'] = $('#inputSearch-client').val();

    // Cria o get request para pegar o cliente
    $.get(remote.getGlobal('default_url') + "client/read", data).done(function (back) {
        if (back['Error'] === true) {

        } else if (back['Exists'] === true) {
            if (button === "Read") {
                update_table(back['Clients']);

            } else if (button === "Update") {
                back['url'] = 'client_update.html';
                ipcRenderer.send('update-window', back);

            }
        } else {
            back['url'] = 'client_read.html'
            ipcRenderer.send('update-window', back);

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

let reset_sell = function () {
    to_receive = 0;
    received = 0;
    change = 0;
    $('#to-receive').text('0.00');
    $('#received').text('0.00');
    $('#change').text('0.00');
    $('#paymentTable tr').remove();
    $('#totalValuePayment').text('0.00');
    $('#saleTable tr').remove();
    $('#to-pay').removeClass("line-through");
    $("#new-value").text(" ");
    discount = 0;
    totalValueSale.text('0.00');
    current_sale = {};
    current_payment = {};
};

let back_start = function () {
    $('html,body').animate({
            scrollTop: $(".first-page").offset().top
        },
        'slow');
    $("#new-value").text(" ");
    discount = 0;
    $('#to-pay').removeClass("line-through");
};

let go_end = function () {
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
            to_return = $(this).html()
        }
    });

    return to_return;
}

$("#btnAddDesconto").on('click', function () {
    let apply_discount = $("#myRange").val();
    if ((discount + apply_discount) <= 6) {
        to_pay = to_receive * ((1 - (apply_discount) / 100));
        to_pay = parseFloat(to_pay.toFixed(2));
        to_receive = to_pay - received;
        to_receive = parseFloat(to_receive.toFixed(2));
        discount += apply_discount;
        $('#to-pay').addClass("line-through");
        $("#new-value").text(" " + to_pay);
        $('#to-receive').text(to_receive);
    }
    $('#myModal2').css('display', 'none');
});
