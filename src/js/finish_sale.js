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

var received = 0;
var to_receive = to_pay;
var change = 0;

$("#to-pay").text(to_pay.toFixed(2))
$("#to-receive").text(to_pay.toFixed(2))

var add_payment = function(){

    var codigo = payment_method
    var tipo = dict_of_values[codigo]
    var preco = parseFloat($("#lblQuantidade").val())

    if (preco === preco) {
        $('#saleTable').append('<tr><td><span class="del"><i class="fas fa-trash-alt"></i></span>'+ codigo +'</td>' +
		'<td>' + tipo + '</td>' + 
        '<td>' + (preco).toFixed(2) + '</td></tr>')
        
        received += preco;
        to_receive = to_pay - received;

        console.log(to_receive)
        if (to_receive < 0){
            change = -to_receive
            to_receive = 0;
        }

        $('#received').text(received.toFixed(2))
        $('#to-receive').text(to_receive.toFixed(2))
        $('#change').text(change.toFixed(2))

        if (received >= to_pay) {
            $('#red').removeClass("red")
            $('#red').addClass("green")
        } else {
            $('#red').removeClass("green")
            $('#red').addClass("red")
        }
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

// $('#btn-end-sale').on('click', function(){

// })