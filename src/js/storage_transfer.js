const {getCurrentWindow} = require('electron').remote;
const {ipcRenderer} = require('electron');

let hash = window.location.hash.slice(1);
window.__args__ = Object.freeze(JSON.parse(decodeURIComponent(hash)));

const btnAdd = $("#btn-add");
const table = $(".product-table");
const lblQnt = $("#productQnt");

$("#navbar").load("../html/navbar-seller.html");

let productList = window.__args__['Product'];
let current_product = NaN;
let current_storage = {};
let product_dictionary = {};

productList.forEach(function (p) {
    product_dictionary[p.id] = p
});

for (let i in productList) {
    productList[i]['name'] = productList[i].name + ' ' + productList[i].size;
}

var $input = $(".typeahead");
$input.typeahead({
    items: 17,
    source: productList,
    autoSelect: true
});
$input.change(function () {
    let current = $input.typeahead("getActive");
    if (current) {
        // Some item from your model is active!
        if (current.name == $input.val()) {
            // This means the exact match is found. Use toLowerCase() if you want case insensitive match.
            current_product = current
        } else {
            // This means it is only a partial match, you can either add a new item
            // or take the active if you don't want new items
            current_product = NaN
        }
    } else {
        // Nothing is active so it is a new value (or maybe empty value)
        current_product = NaN
    }
});

btnAdd.on('click', function () {
    if (current_product) {
        add_item(current_product.id)
    }
});

// Deleta da tabela
table.on('click', "tr td .del", function (e) {
    // Pega o código e deleta ele
    delete current_storage[$(".product-table tr td:first").text()];
    $(this).parent().parent().remove();
    e.stopPropagation();
});

// Adiciona Item
let add_item = function (id) {
    let qnt = parseInt(lblQnt.val());
    if (current_storage[id] !== undefined) {
        current_storage[id] += qnt;
    } else {
        current_storage[id] = qnt;
    }
    $(".product-table tr").remove();
    for (id in current_storage) {
        let p = product_dictionary[id];
        table.append('<tr class="table-search"><td><span class="del"><i class="fas fa-trash-alt"></i></span>' + p.id + '</td><td>' + p.name + '</td><td>' + p.size + '</td><td>' + current_storage[id] + '</td></tr>');
    }
    lblQnt.val(1);
    $input.val("");
    current_product = NaN;
};

// Chama quando aperta enter
lblQnt.keypress(function (event) {
    if (event.which === 13 && current_product) {
        add_item(current_product.id);
    }
});