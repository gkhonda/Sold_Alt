const remote = require('electron').remote;
let hash = window.location.hash.slice(1);
window.__args__ = Object.freeze(JSON.parse(decodeURIComponent(hash)));

const saleDetails = window.__args__['sale_details'];
const saleItens = window.__args__['sale_itens'];
const productList = window.__args__['productList'];
const payments = window.__args__['sale_payments'];
let change = window.__args__['change'];
let discount = window.__args__['discount'];
discount = eval(discount);
let discountedTotal = saleDetails['Total'] * (1 - discount / 100);
let discountValue = saleDetails['Total'] * discount / 100;
change = parseFloat(String(Math.round(change * 100) / 100)).toFixed(2);
discountValue = parseFloat(String(Math.round(discountValue * 100) / 100)).toFixed(2);
discountedTotal = parseFloat(String(Math.round(discountedTotal * 100) / 100)).toFixed(2);
let client = window.__args__['client'];
if (client.name === "Cliente"){
    client.name = "";
}

let now = new Date();
let day = ("0" + now.getDate()).slice(-2);
let month = ("0" + (now.getMonth() + 1)).slice(-2);
let today = now.getFullYear() + "-" + (month) + "-" + (day) + " " + format(now.getHours()) + ":" + format(now.getMinutes());


let list_of_products = [];

Object.keys(saleItens).forEach(function (id) {
   productList.forEach(function (obj) {
       if (obj.id == id) {
           obj.qnt = saleItens[id];
           obj.price = (obj.price_sell).toFixed(2);
           obj.total = (obj.qnt * obj.price_sell).toFixed(2);
           list_of_products.push(obj);
           addInTable(obj, saleItens[id]);
       }
   })
});

$('#totalSale').text(discountedTotal);
$('#vendedor-id').text(remote.getGlobal('Vendedor'));
$('#loja').text(saleDetails['LojaNome']);
$('#time').text(today);
if (client.name){
    $('#client-id').text("Cliente: " + client.name);
}


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

let paymentMethods = [
  'Dinheiro',
  'Cheque',
  'Débito',
  'Crédito',
  'Transferência'
];

let list_of_payments = []
paymentMethods.forEach( function (pm) {
  if (pm in payments) {
    $('#paymentData').append(`<td>R$ ${payments[pm]}</td>`);
      list_of_payments.push('R$ ' + payments[pm].toFixed(2));
  } else {
    $('#paymentData').append('<td>R$ 0.00</td>');
      list_of_payments.push("R$ 00.00");
  }
});

$('#paymentData').append('<td>' + change + '</td>');
$('#paymentData').append(`<td>${discount} %</td>`);

let data = {
    'list_of_products': list_of_products,
    'change': change,
    'discount': discount,
    'today': today,
    'list_of_payments': list_of_payments,
    'loja': saleDetails['LojaNome'],
    'vendedor': remote.getGlobal('Vendedor'),
    'total': discountedTotal,
    'email': client.email
};

$.post(remote.getGlobal('default_url') + "sale/email", JSON.stringify(data)).done(function (back) {
    console.log(back);
});
