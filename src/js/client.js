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
var create_client = function()
{
	// Remove as classes de erro - caso elas estejam lá ainda.
  $('#helpBlock').remove()
  $('div').removeClass('has-error')

	// cria objeto com os dados do form
	var data = $('#form').serializeArray().reduce(function(obj, item)
	{
		obj[item.name] = item.value;
		return obj;
	}, {})

	// Verifica cpf e nome não estão em branco
	if (!data['cpf'])
	{
		$('#div-cpf')
			.addClass('has-error')
			.append('<span id="helpBlock" class="help-block"> CPF não pode estar em branco.</span>')
		return	
	}

	if (data['cpf'].length < 14)
	{
		$('#div-cpf')
			.addClass('has-error')
			.append('<span id="helpBlock" class="help-block"> CPF está incompleto.</span>')
		return	
	}

	if (!data['complete_name'])
	{
		$('#div-complete_name')
			.addClass('has-error')
			.append('<span id="helpBlock" class="help-block"> Nome não pode estar em branco.</span>')
		return
	}

	// Cria o post request para criar cliente
	$.post("http://127.0.0.1:8000/client/create", data).done(function(back)
	{
		if (back['Error'] === true)
		{
			ipcRenderer.send('login',
				{'type' : 'sad',
				'message' : 'Já existe um cliente com este CPF.',
				'text' : 'Digite um CPF válido'})
			return
		}
		else if (back['Submitted'] === true)
		{
			ipcRenderer.send('login',
				{'type' : 'happy',
				'message' : 'Cliente Cadastrado com Sucesso!',
				'text' : 'Aperte Ok para fechar'})
			return
		}
		else
		{
			win.showUrl('src/html/create_client.html', back)
		}
	}).fail(function()
	{
		ipcRenderer.send('login', 
                {'type' : 'sad', 
                'message' : 'Erro na comunicação com o servidor.',
                'text' : "Verifique sua conexão com a internet."})
	})
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

// Botão de criar cliente
$("#btnCreate").on("click", function (e) {
  create_client()
})

// Botão de ler um cliente
$("#btnRead").on("click", function(e) {
	return
})

// Botão de atualizar um cliente
$("#btnUpdate").on("click", function(e) {
	return
})

// Botão de deletar um cliente
$("#btnDelete").on("click", function(e) {
	return
})

// Chama quando aperta enter
$(".form-control").keypress(function(event) {
    if (event.which == 13) create_client()
})