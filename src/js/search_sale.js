var now = new Date();

var day = ("0" + now.getDate()).slice(-2);
var month = ("0" + (now.getMonth() + 1)).slice(-2);
var today = now.getFullYear() + "-" + (month) + "-" + (day);
var y = now.getFullYear() + "-" + (month) + "-" + (day - 5);

const datepicker1 = $("#datepicker1");
const datepicker2 = $("#datepicker2");
const btnPesquisa = $("#btn-pesquisa");
const inputSearch = $('#inputSearch');
const tableSearch = $("#tableSearch");
const clienteModal = $('#cliente-modal');
const valorModal = $("#valor-modal");
const modalTable = $(".modal-table");

datepicker1.val(y);
datepicker2.val(today);

datepicker2.on('click', function () {
    console.log(datepicker1.val());
});

btnPesquisa.on('click', function () {
    let data = {
        'name_or_cpf': inputSearch.val(),
        'initial_date': datepicker1.val(),
        'final_date': datepicker2.val(),
        'unique': false
    };
    $.get("http://127.0.0.1:8000/sale/read", data).done(function (back) {
        update_table(back['sale'])
    }).fail(function () {
        console.log("fail")
    });
});


let update_table = function (list_of_sales) {
    $("#tableSearch .plus-sale").remove();
    list_of_sales.slice().reverse().forEach(function (c) {
        tableSearch.append('<tr class="plus-sale"><td class="details-control"><img src="../../public/images/plus-icon.png">' + c.id + '</td><td>' + c.datetime.substring(0, 10) + " " + c.datetime.substring(11, 16) + '</td><td>' + c.client__cpf + '</td><td>' + c.client__name + '</td><td>' + c.value + '</td></tr>')
    })
};


tableSearch.on('click', 'tr td img', function () {
    let id = $(this).parent().text();
    let data = {
        'unique': true,
        'id': id
    };
    $.get("http://127.0.0.1:8000/sale/read", data).done(function (back) {
        $('#span-venda').text(id);
        sale = back['sale'];
        products_of_sale = back['products_of_sale'];
        clienteModal.text(sale.client__name);
        valorModal.text(sale.value);
        console.log(products_of_sale)
        products_of_sale.forEach(function (c) {
            console.log(c)
            modalTable.append('<tr><td>' + c.id + '</td><td>' + c.name + '</td><td>' + c.size + '</td><td>' + c.quantity + '</td></tr>')
        });
        $('.modal').css('display', 'block');
        console.log(back);
    }).fail(function () {
        console.log("fail")
    });
});

$('.close').click(function () {
    $('.modal').css('display', 'none');
});
