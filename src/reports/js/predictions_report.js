let hash = window.location.hash.slice(1);
window.__args__ = Object.freeze(JSON.parse(decodeURIComponent(hash)));

const predictions = window.__args__['predictions'];
const month = window.__args__['month'];

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

$('#mes').text('dezembro');

var cols = ['product', 'size'];
var storeRegex, store;
for (var field in predictions[0]) {
    storeRegex = field.match(/(.*)_total/);
    if (storeRegex){
        store = storeRegex[1];
        $('#table thead tr').append(`<th>Vendas em ${store}</th>`);
        cols.push(field);
    } else if (field === 'total') {
        $('#table thead tr').append(`<th>${field}</th>`);
        cols.push(field);
    }
}

predictions.forEach(function (pred) {
    $('#table tbody').append('<tr></tr>')
    cols.forEach(function(col) {
        $('#table tbody tr:last-child').append(`<td>${pred[col]}</td>`);
    });
});
