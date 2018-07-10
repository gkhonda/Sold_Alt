const {BrowserWindow, getCurrentWindow} = require('electron').remote

// Variaveis auxiliares

// Guarda o produto atual, iniciando pelo código mais baixo
// Depois, isso tudo será pego do BD

var current_product = {
	'Codigo' : 1,
	'Produto' : 'CAMISETA MANGA CURTA',
	'Tamanho' : 'M',
	'Preco' : "30.00"
}

var product_dictionary = {}

// Alguns produtos pegos pelo BD
var a = {
	'Codigo' : 1,
	'Produto' : 'CAMISETA MANGA CURTA',
	'Tamanho' : '00',
	'Preco' : "30.00",
	'src' : "../images/tshirt.png"
}

var b = {
	'Codigo' : 2,
	'Produto' : 'CAMISETA MANGA CURTA',
	'Tamanho' : 'G',
	'Preco' : "30.00",
	'src' : "../images/tshirt.png"
}

var c = {
	'Codigo' : 3,
	'Produto' : 'CAMISETA MANGA CURTA',
	'Tamanho' : 'M',
	'Preco' : "30.00",
	'src' : "../images/tshirt.png"
}

var d = {
	'Codigo' : 4,
	'Produto' : 'BERMUDA',
	'Tamanho' : 'PP',
	'Preco' : "12.23",
	'src' : "../images/bermuda.png"
}

// var e = {
// 	'Codigo' : 4,
// 	'Produto' : 'BERMUDA',
// 	'Tamanho' : 'PP',
// 	'Preco' : "67.50"
// }

// Lista de produtos
var list_of_products = [a, b, c, d]

// Coloca os produtos na tabela
list_of_products.forEach(function(p) {
	$('.search-table').append('<tr class="table-search"><td>'+p.Codigo+'</td><td>'+p.Produto+'</td><td>'+p.Tamanho+'</td><td>'+p.Preco+'</td></tr>')
	product_dictionary[p.Codigo] = p
})

var update_div = function(product) {
	$('#productId').val(product.Codigo);
	$('#productDesc').text(product.Produto + ' ' + product.Tamanho);
	$('#imgProduct').attr("src", product.src)
}


// Apaga produto da compra
$("tbody").on('click', "tr td .del", function (e) {
	$(this).parent().parent().remove();
	e.stopPropagation();
	atualiza_venda(5)
})

// Funções para o botão de diminui/aumenta a quantidade 
var quantitiy=0;
$('.btn-success').click(function(e){
	// Stop acting like a button
	e.preventDefault();
	// Get the field name
	var quantity = parseInt($('.quantity').val());
	// If is not undefined
		$('.quantity').val(quantity + 1);
		// Increment
});

$('.btn-danger').click(function(e){
	// Stop acting like a button
	e.preventDefault();
	// Get the field name
	var quantity = parseInt($('.quantity').val());
	// If is not undefined
		// Increment
		if(quantity>1){
			$('.quantity').val(quantity - 1);
		}
});

// Pega da tabela
$('.table-search').on('click', function(e) {

	var product = []

	$(this).find('td').each(function(){
		product.push($(this).html())
	})

	update_div(product_dictionary[product[0]])

	e.preventDefault();
});

// Procura na tabela
$("#inputSearch").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#tableSearch tr").filter(function(e) {
		if(e != 0) {
			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		}
    });
});

$("#btnAdd").on("click", function() {
	add_item()
});

$("#productId").on("keyup", function(e) {
	if (e.which == 13) add_item()
	if (product_dictionary[$(this).val()] != undefined) {
		update_div(product_dictionary[$(this).val()])
	}
	
})

// Atualiza preço total da venda, no valor final da tabela
var atualiza_venda = function(table_lenght) {
	var price = 0
	$("#saleTable").find('tr').each(function(){
		$(this).find('td').each(function(index){
			if (index == table_lenght-1) {
				price += parseFloat($(this).html())
			}
		})
	})

	$('#totalValue').text((price).toFixed(2))

}

var add_item = function() {
	var id = $('#productId').val()
	var qnt = parseInt($('.quantity').val());
	if (product_dictionary[id] !== undefined){
		var p = product_dictionary[id]
		$('#saleTable').append('<tr><td><span class="del"><i class="fas fa-trash-alt"></i></span>2</td>' +
		'<td class="text"><span class="text-el">' + p.Produto + '</span></td>' +
		'<td>' + p.Tamanho + '</td>' + 
		'<td>' + qnt + '</td>' + 
		'<td>' + (p.Preco * qnt).toFixed(2) + '</td></tr>')
		
		atualiza_venda(5)

		$('.quantity').val(1)

	} else {
		alert("Verifique se o id é válido")
	}
}

$('.finish-sale').on('click', function() {

	var name
	var qnt
	var price

	tabela = {}

	venda = {
		'Total' : $('#totalValue').text(),
		'Vendedor' : 'Mike',
	}

	$("#saleTable").find('tr').each(function(){
		$(this).find('td').each(function(index){

			if (index == 1) {
				name = $(this).text()
			}

			if (index == 3) {
				qnt = parseFloat($(this).html())
			}

			if (index == 4) {
				price = parseFloat($(this).html())
			}
		})

		tabela[name] = [qnt, price]
	})

	console.log(venda)
	console.log(tabela)

	win = getCurrentWindow()

	win.showUrl('src/html/finish_sale.html', '', () => {
	})
})

