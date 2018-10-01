let hash = window.location.hash.slice(1);
window.__args__ = Object.freeze(JSON.parse(decodeURIComponent(hash)));

const productTable = $('#table');
const storeSpan = $('#loja');
const productDetails = window.__args__['list_of_products'];
const store = window.__args__['store'];
$('#to').text(window.__args__['to']);
$('#from').text(window.__args__['from']);
storeSpan.text(store);

productDetails.forEach(function (c) {
    productTable.append('<tr><td>' + c.id + '</td><td>' + c.name + '</td><td>' + c.size + '</td><td>' + c.qnt + '</td></tr>')
});