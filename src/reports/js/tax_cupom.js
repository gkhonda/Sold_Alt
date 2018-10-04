const remote = require('electron').remote;
let hash = window.location.hash.slice(1);
window.__args__ = Object.freeze(JSON.parse(decodeURIComponent(hash)));

const saleDetails = window.__args__['sale_details'];
const saleItens = window.__args__['sale_itens'];
const productList = window.__args__['productList'];

let now = new Date();
let day = ("0" + now.getDate()).slice(-2);
let month = ("0" + (now.getMonth() + 1)).slice(-2);
let today = now.getFullYear() + "-" + (month) + "-" + (day) + " " + format(now.getHours()) + ":" + format(now.getMinutes());

Object.keys(saleItens).forEach(function (id) {
   productList.forEach(function (obj) {
       if (obj.id == id) {
           addInTable(obj, saleItens[id]);
       }
   })
});

$('#totalSale').text(saleDetails['Total']);
$('#vendedor-id').text(remote.getGlobal('Vendedor'));
$('#loja').text(saleDetails['LojaNome']);
$('#time').text(today);


function addInTable(obj, qnt) {
    $('#customerTable').append("<tr><th>" + obj.name + "</th>" +
        "<th>" + obj.size + "</th><th>"
        + qnt + "</th><th>"
        + (obj.price_sell).toFixed(2) + "</th><th>"
        + (qnt * obj.price_sell).toFixed(2) + "</th></tr>")

}

function format(n){
    return n > 9 ? "" + n: "0" + n;
}