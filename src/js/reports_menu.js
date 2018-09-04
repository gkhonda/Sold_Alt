// Imports do electron
const remote = require('electron').remote;
const {ipcRenderer} = require('electron');

// Include navbar
$(function () {
    $("#navbar").load("../html/navbar_adm.html");
});

let now = new Date();
let day = ("0" + now.getDate()).slice(-2);
let month = ("0" + (now.getMonth())).slice(-2);
let month2 = ("0" + (now.getMonth() + 1)).slice(-2);
let today = now.getFullYear() + "-" + (month) + "-" + (day);
let today2 = now.getFullYear() + "-" + (month2) + "-" + (day);

const datepicker1 = $("#datepicker1");
const datepicker2 = $("#datepicker2");
const datepicker3 = $("#datepicker3");
const datepicker4 = $("#datepicker4");
const selectStore1 = $("#select-store");

datepicker1.val(today);
datepicker2.val(today2);
datepicker3.val(today);
datepicker4.val(today);

$('#btn-pesquisa').on('click', function () {
    data = {
        'initial_date': datepicker1.val(),
        'final_date': datepicker2.val(),
        'store' : selectStore1.val()
    };
    $.get(remote.getGlobal('default_url') + "reports/report_by_payment", data).done(function (back) {
        console.log(back);
        back['url'] = 'src/reports/html/payment_report.html';
        ipcRenderer.send('pdf', back);
    }).fail(function () {
        ipcRenderer.send('login',
            {
                'type': 'sad',
                'message': 'Erro de conexão.',
                'text': "Verifique a conexão com a Internet."
            })
    });
});
