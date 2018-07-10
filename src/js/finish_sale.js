require('electron-window').parseArgs()
const {BrowserWindow, getCurrentWindow} = require('electron').remote

let win, new_win

// Para manipular a Janela Atual
win = getCurrentWindow()

// Inicia com dinheiro como método de pagamente
var payment_method = 1

var dict_of_values = {
    1 : 'Dinheiro',
    2 : 'Cheque',
    3 : 'Debito',
    4 : 'Credito',
    5: 'Transferencia'
}

var to_pay = 32.00;

$("#to-pay").text(to_pay.toFixed(2))

var add_payment = function(){

    var codigo = payment_method
    var tipo = dict_of_values[codigo]
    var preco = parseFloat($("#lblQuantidade").val())

    if (preco === preco) {
        $('#saleTable').append('<tr><td><span class="del"><i class="fas fa-trash-alt"></i></span>'+ codigo +'</td>' +
		'<td>' + tipo + '</td>' + 
		'<td>' + (preco).toFixed(2) + '</td></tr>')
    }
}


$(".btn-toolbar .btn").click(function(){
    $('.btn').removeClass('active');
    $(this).addClass('active'); 
    payment_method = $(this).attr('value')
});


$("#add-payment").on('click', function(e) {
    add_payment();
    $("#lblQuantidade").val('')
})


$("#lblQuantidade").keypress(function(event) {
    if (event.which == 13) {
        add_payment();
        $("#lblQuantidade").val('')
    }
});