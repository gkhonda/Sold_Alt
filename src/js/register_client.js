const {BrowserWindow, getCurrentWindow} = require('electron').remote

const path = require('path')
const url = require('url')

let win, new_win

// Para manipular a Janela Atual
win = getCurrentWindow()

const {ipcRenderer} = require('electron')

// Função formatadora de string dado uma máscara
var format = function(mask, document)
{
	var i = document.value.length
	var out = mask.substring(0, 1)
	var text = mask.substring(i)

	if (text.substring(0, 1) != out)
	{
		document.value += text.substring(0, 1)
	}
}

// Função que fará comunicação com o módulo django
function register_client()
{
	// TODO montar no django primeiro depois ver como montar
	return
}


// Formata cpf
$("#cpf").keypress(function() {
	format("###.###.###-##", this)
})

// Formata telefone
$("#telephone").keypress(function() {
	format("##-#########", this)
})

// Formata CEP
$("#cep").keypress(function() {
	format("#####-###", this)
})

// Chama quando clica
$("#btnLogin").on("click", function (e) {
    register_client()
})

// Chama quando aperta enter
$(".form-control").keypress(function(event) {
    if (event.which == 13) register_client();
});