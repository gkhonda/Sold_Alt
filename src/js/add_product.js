// const {BrowserWindow, getCurrentWindow} = require('electron').remote

// const path = require('path')
// const url = require('url')

// let win, new_win

// // Para manipular a Janela Atual
// win = getCurrentWindow()

// const {ipcRenderer} = require('electron')

var prices = {
	cost : 0,
	sell : 0
};


$('.btn').on('click', function(){
	var name = $('#name').val();
	var size = $('#size').val();
	var price_in = $('#price_in').val();
	var price_out = $('#price_out').val();
	if (name === '' || size === null || prices.cost === 0 || prices.sell === 0){
		$('#sent').text('Preencha todos os campos');
		if ($('#sent').hasClass('hasnt-error')){
			$('#sent').removeClass('hasnt-error');
		}
		if (!$('#sent').hasClass('has-error')){
			$('#sent').addClass('has-error');
		}
		if ($('#sent').css('display') === 'none'){
			$('#sent').fadeIn(100);
		}
	}
	else {
		$('#sent').text('Produto enviado com sucesso');
		if ($('#sent').hasClass('has-error')){
			$('#sent').removeClass('has-error');
		}
		if (!$('#sent').hasClass('hasnt-error')){
			$('#sent').addClass('hasnt-error');
		}
		if ($('#sent').css('display') === 'none'){
			$('#sent').fadeIn(100);
		}
		//add to database
	}
})

$('.prices input').on('keyup', function(event) {
	if (event.which < 58 && event.which > 47 || event.which === 8){ //it's a number or backspace
		if ($(this).attr('id') === 'price_in'){
			var whichPrice = 'cost';
		}
		else {
			var whichPrice = 'sell';
		}
		if (event.which !== 8){ //not backspace
			var digit = Number(String.fromCharCode(event.which));
			prices[whichPrice] = prices[whichPrice] * 10 + digit;
		}
		else {
			prices[whichPrice] = prices[whichPrice] / 10 >> 0;
		}
		$(this).val('R$' + prices[whichPrice] / 100);
	}
	else {
		var input = $(this).val();
		input = input.slice(0,-1);
		$(this).val(input);
	}
});

$('.data').on('click', function() {
	if ($('#sent').css('display') !== 'none'){
			$('#sent').fadeOut(100);
	}
})