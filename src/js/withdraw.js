let type = "Dinheiro";
$.post("http://127.0.0.1:8000/withdraw/read", {'method': 'Dinheiro'}).done(function (back) {
    $('#money-quantity').text(back['quantity'].toFixed(2));
});


$('#change-type').click(function () {
    if (type === "Dinheiro") {
        $.post("http://127.0.0.1:8000/withdraw/read", {'method': 'Cheque'}).done(function (back) {
            console.log(back['quantity']);
            $('#money-quantity').text(back['quantity'].toFixed(2));
            $('#span-method').text("Cheque");
            type = "Cheque";
            $("#type-image").attr("src", "../images/Dinheiro.png");

        });
    } else {
        $.post("http://127.0.0.1:8000/withdraw/read", {'method': 'Dinheiro'}).done(function (back) {
            console.log(back['quantity']);
            $('#money-quantity').text(back['quantity'].toFixed(2));
            $('#span-method').text("Dinheiro");
            type = "Dinheiro";
            $("#type-image").attr("src", "../images/Cheque.png");

        });
    }

});