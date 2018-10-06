const {ipcRenderer} = require('electron');
const {getCurrentWindow} = require('electron').remote;
const remote = require('electron').remote;

$(function () {
    $("#navbar").load("../html/navbar_adm.html");
});


var month = {
    0: 'janeiro',
    1: 'fevereiro',
    2: 'março',
    3: 'abril',
    4: 'maio',
    5: 'junho',
    6: 'julho',
    7: 'agosto',
    8: 'setembro',
    9: 'outubro',
    10: 'novembro',
    11: 'dezembro'
}
var date = new Date();
date = date.getMonth();
$('.mes').text(month[date + 1]);

$('.generate').on('click', function(){
    getPredictions({'create': true})
});

$('.open').on('click', function() {
    getPredictions({'create': false})
});

function getPredictions(request){
    $.get(remote.getGlobal('default_url') + 'prediction', request).done(function(back){
        console.log(back);
    });
}
