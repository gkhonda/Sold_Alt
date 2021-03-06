// Imports do electron
const remote = require('electron').remote;
const {ipcRenderer} = require('electron');

let hash = window.location.hash.slice(1);
window.__args__ = Object.freeze(JSON.parse(decodeURIComponent(hash)));

let now = new Date();
let day = ("0" + now.getDate()).slice(-2);
let month = ("0" + (now.getMonth()+1)).slice(-2);
let month2 = ("0" + (now.getMonth()+1)).slice(-2);
let today = now.getFullYear() + "-" + (month) + "-" + (day);
let today2 = now.getFullYear() + "-" + (month2) + "-" + (day);

const datepicker1 = $("#datepicker1");
const datepicker2 = $("#datepicker2");
const datepicker3 = $("#datepicker3");
const datepicker4 = $("#datepicker4");
const selectStore1 = $("#select-store");
const selectStore2 = $("#select-store2");

datepicker1.val(today);
datepicker2.val(today2);
datepicker3.val(today);
datepicker4.val(today2);

// Include navbar
$(function () {
    if (window.__args__['from'] === 'adm') {
        $("#navbar").load("../html/navbar_adm.html");
        $("#title-seller").addClass('invisible');
    } else {
        $("#navbar").load("../html/navbar-seller.html");
        $("#title-adm").addClass('invisible');
        $("#title-seller").addClass('m-b-50');
    }
});

$('#btn-pesquisa').on('click', function () {
    data = {
        'initial_date': datepicker1.val(),
        'final_date': datepicker2.val(),
        'store' : selectStore1.val()
    };
    $.get(remote.getGlobal('default_url') + "reports/report_by_payment", data).done(function (back) {
        console.log(back);
        back['url'] = 'payment_report.html';
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

$('#btn-pesquisa2').on('click', function () {
    data = {
        'initial_date': datepicker3.val(),
        'final_date': datepicker4.val(),
        'store' : selectStore2.val()
    };
    $.get(remote.getGlobal('default_url') + "reports/report_by_products", data).done(function (back) {
        back['url'] = 'product_report.html';
        back['from'] = datepicker3.val();
        back['to'] = datepicker4.val();
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