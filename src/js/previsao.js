const {ipcRenderer} = require('electron');
const {getCurrentWindow} = require('electron').remote;
const remote = require('electron').remote;

$(function () {
    $("#navbar").load("../html/navbar_adm.html");
});


var months = {
    1: 'janeiro',
    2: 'fevereiro',
    3: 'março',
    4: 'abril',
    5: 'maio',
    6: 'junho',
    7: 'julho',
    8: 'agosto',
    9: 'setembro',
    10: 'outubro',
    11: 'novembro',
    12: 'dezembro'
}

var date = new Date();
var month = date.getMonth() + 2;
if (month === 13) month = 1;
var year = date.getFullYear();
$('.mes').text(months[month]);

$('.generate').on('click', function(){
    getPredictions({'create': true, 'month': month, 'year': year})
});

$('.open').on('click', function() {
    getPredictions({'create': false, 'month': month, 'year': year})
});

function getPredictions(request){
    $.get(remote.getGlobal('default_url') + 'prediction', request).done(function(back){
        back['url'] = 'predictions_report.html';
        back['month'] = month;
        ipcRenderer.send('pdf', back);
    }).fail(function () {
        ipcRenderer.send('login',
            {
                'type': 'sad',
                'message': 'Erro de conexão.',
                'text': "Verifique a conexão com a Internet."
            })
    });;
}
