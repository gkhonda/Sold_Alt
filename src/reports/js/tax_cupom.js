const remote = require('electron').remote;
let hash = window.location.hash.slice(1);
window.__args__ = Object.freeze(JSON.parse(decodeURIComponent(hash)));

const saleDetails = window.__args__['sale_details'];
const saleItens = window.__args__['sale_itens'];
const productList = window.__args__['productList'];
const payments = window.__args__['sale_payments'];
var change = window.__args__['change'];
var discount = window.__args__['discount'];
discount = eval(discount);
var discountedTotal = saleDetails['Total'] * (1 - discount / 100);
var discountValue = saleDetails['Total'] * discount / 100;
change = parseFloat(String(Math.round(change * 100) / 100)).toFixed(2);
discountValue = parseFloat(String(Math.round(discountValue * 100) / 100)).toFixed(2);
discountedTotal = parseFloat(String(Math.round(discountedTotal * 100) / 100)).toFixed(2);


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

$('#totalSale').text(discountedTotal);
$('#vendedor-id').text(remote.getGlobal('Vendedor'));
$('#loja').text(saleDetails['LojaNome']);
$('#time').text(today);

function addInTable(obj, qnt) {
    $('#customerTable').append("<tr><td>" + obj.name + "</td>" +
        "<td>" + obj.size + "</td><td>"
        + qnt + "</td><td>"
        + (obj.price_sell).toFixed(2) + "</td><td>"
        + (qnt * obj.price_sell).toFixed(2) + "</td></tr>")

}

function format(n){
    return n > 9 ? "" + n: "0" + n;
}

var paymentMethods = [
  'Dinheiro',
  'Cheque',
  'Débito',
  'Crédito',
  'Transferência'
];

paymentMethods.forEach( function (pm) {
  if (pm in payments) {
    $('#paymentData').append(`<td>${payments[pm]}</td>`);
  } else {
    $('#paymentData').append('<td>0.00</td>');
  }
});

$('#paymentData').append(`<td>${change}</td><td>${discountValue}(${discount}%)</td>`);
