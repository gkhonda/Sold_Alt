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
var client_create = function()
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
			win.showUrl('src/html/client_create.html', back)
		}
	}).fail(function()
	{
		ipcRenderer.send('login', 
                {'type' : 'sad', 
                'message' : 'Erro na comunicação com o servidor.',
                'text' : "Verifique sua conexão com a internet."})
	})
}

// Função que consulta o cliente no BD, se sucesso retorna um json com os dados indexados do cliente
// (id, cpf, name, email, tel, cep)
var client_read = function()
{
	// cria objeto com os dados do form
	var data = $('#form').serializeArray().reduce(function(obj, item)
	{
		obj[item.name] = item.value;
		return obj;
	}, {})

	// Cria o get request para pegar o cliente
	$.get("http://127.0.0.1:8000/client/read", data).done(function(back)
	{
		if (back['Error'] === true)
		{
			ipcRenderer.send('login',
				{'type' : 'sad',
				'message' : 'Cliente não encontrado.',
				'text' : 'Verifique o CPF ou o nome'})
			return
		}
		else if (back['Exists'] === true)
		{
			// NEEDS MORE WORK
			client = {'id': back['id'],
												'cpf': back['cpf'],
												'name': back['name'],
												'email': back['email'],
												'tel': back['tel'],
												'cep': back['cep']}
			console.log(client)		
			return
		}
		else
		{
			win.showUrl('src/html/client_read.html', back)
		}
	}).fail(function()
	{
		ipcRenderer.send('login', 
                {'type' : 'sad', 
                'message' : 'Erro na comunicação com o servidor.',
                'text' : "Verifique sua conexão com a internet."})
	})
	console.log(client)
	return client
}

var client_delete = function()
{
	// chama client_read para pegar os dados da entrada NOT WORKING
	var client = client_read()
	$.get("http://127.0.0.1:8000/client/delete", client['id']).done(function(back)
	{
		if (back['Error'] === true)
		{
			ipcRenderer.send('login',
				{'type' : 'sad',
				'message' : 'Erro ao tentar deletar cliente.',
				'text' : 'Verifique o CPF ou o nome'})
			return
		}
		else if (back['Deleted'] === true)
		{
			ipcRenderer.send('login', 
                {'type' : 'happy', 
                'message' : 'Cliente deletado com sucesso.',
                'text' : "Aperte Ok para continuar"})
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
  client_create()
})

// Botão de ler um cliente
$("#btnRead").on("click", function(e) {
	client_read()
})

// Botão de deletar um cliente
$("#btnDelete").on("click", function(e) {
	client_delete()
})

// Chama quando aperta enter
$(".form-control").keypress(function(event) {
    if (event.which == 13)
    {
    	if ($("#btnCreate").length > 0) client_create()
    	else if ($("#btnRead").length > 0) client_read()
    	else if ($("#btnDelete").length > 0) client_delete()
    }
})