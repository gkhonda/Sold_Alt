const {BrowserWindow, getCurrentWindow} = require('electron').remote
const remote = require('electron').remote;

const path = require('path')
const url = require('url')

require('electron-window').parseArgs()

let win, new_win

// Para manipular a Janela Atual
win = getCurrentWindow()

const {ipcRenderer} = require('electron')

// Função formatadora de string dado uma máscara
var format = function (mask, document) {
    var i = document.value.length
    var out = mask.substring(0, 1)
    var text = mask.substring(i)

    if (text.substring(0, 1) != out) {
        document.value += text.substring(0, 1)
    }
}

// Função que fará comunicação com o módulo django
var client_create = function () {
    // Remove as classes de erro - caso elas estejam lá ainda.
    $('#helpBlock').remove()
    $('div').removeClass('has-error')

    // cria objeto com os dados do form
    var data = $('#form').serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {})

    // Verifica cpf e nome não estão em branco
    if (!data['cpf']) {
        $('#div-cpf')
            .addClass('has-error')
            .append('<span id="helpBlock" class="help-block"> CPF não pode estar em branco.</span>')
        return
    }

    if (data['cpf'].length < 14) {
        $('#div-cpf')
            .addClass('has-error')
            .append('<span id="helpBlock" class="help-block"> CPF está incompleto.</span>')
        return
    }

    if (!data['complete_name']) {
        $('#div-complete_name')
            .addClass('has-error')
            .append('<span id="helpBlock" class="help-block"> Nome não pode estar em branco.</span>')
        return
    }

    // Cria o post request para criar cliente
    $.post(remote.getGlobal('default_url') + "client/create", data).done(function (back) {
        if (back['Error'] === true) {
            ipcRenderer.send('login',
                {
                    'type': 'sad',
                    'message': 'Já existe um cliente com este CPF.',
                    'text': 'Digite um CPF válido'
                })
            return
        }
        else if (back['Submitted'] === true) {
            ipcRenderer.send('login',
                {
                    'type': 'happy',
                    'message': 'Cliente Cadastrado com Sucesso!',
                    'text': 'Aperte Ok para fechar'
                })
            return
        }
        else {
            win.showUrl('src/html/client_create.html', back)
        }
    }).fail(function () {
        ipcRenderer.send('login',
            {
                'type': 'sad',
                'message': 'Erro na comunicação com o servidor.',
                'text': "Verifique sua conexão com a internet."
            })
    })
}

// Função que consulta o cliente no BD, se sucesso retorna um json com os dados indexados do cliente
// (id, cpf, name, email, tel, cep)
var client_read = function (button) {
    // Remove as classes de erro - caso elas estejam lá ainda.
    $('#helpBlock').remove()
    $('div').removeClass('has-error')


    // cria objeto com os dados do form
    var data = {}
    data['cpf'] = $('#inputSearch').val()

    // Cria o get request para pegar o cliente
    $.get(remote.getGlobal('default_url') + "client/read", data).done(function (back) {
        if (back['Error'] === true) {
            return
        } else if (back['Exists'] === true) {
            if (button === "Read") {
                update_table(back['Clients'])
                return
            } else if (button === "Update") {
                win.showUrl('src/html/client_update.html', back)
                return
            }
        } else {
            win.showUrl('src/html/client_read.html', back)
            return
        }
    }).fail(function () {
        ipcRenderer.send('login',
            {
                'type': 'sad',
                'message': 'Erro na comunicação com o servidor.',
                'text': "Verifique sua conexão com a internet."
            })
    })
}

var client_update = function () {
    // cria objeto com os dados do form
    var data = $('#form').serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {})

    // Verifica cpf e nome não estão em branco
    if (!data['cpf']) {
        $('#div-cpf')
            .addClass('has-error')
            .append('<span id="helpBlock" class="help-block"> CPF não pode estar em branco.</span>')
        return
    }

    if (data['cpf'].length < 14) {
        $('#div-cpf')
            .addClass('has-error')
            .append('<span id="helpBlock" class="help-block"> CPF está incompleto.</span>')
        return
    }

    if (!data['complete_name']) {
        $('#div-complete_name')
            .addClass('has-error')
            .append('<span id="helpBlock" class="help-block"> Nome não pode estar em branco.</span>')
        return
    }

    // Cria o post request para alterar cliente
    $.post(remote.getGlobal('default_url') + "client/update", data).done(function (back) {
        if (back['Error'] === true) {
            ipcRenderer.send('login',
                {
                    'type': 'sad',
                    'message': 'Erro ao alterar cliente.',
                    'text': 'Verifique as informações digitadas.'
                })
            return
        }
        else if (back['Updated'] === true) {
            ipcRenderer.send('login',
                {
                    'type': 'happy',
                    'message': 'Cliente Alterado com Sucesso!',
                    'text': 'Aperte Ok para fechar'
                })
            return
        }
        else {
            win.showUrl('src/html/client_update.html', back)
        }
    }).fail(function () {
        ipcRenderer.send('login',
            {
                'type': 'sad',
                'message': 'Erro na comunicação com o servidor.',
                'text': "Verifique sua conexão com a internet."
            })
    })
}

var client_delete = function () {
    // cria objeto com os dados do form
    var data = $('#form').serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {})

    $.get(remote.getGlobal('default_url') + "client/delete", data).done(function (back) {
        if (back['Error'] === true) {
            ipcRenderer.send('login',
                {
                    'type': 'sad',
                    'message': 'Erro ao tentar deletar cliente.',
                    'text': 'Verifique o CPF ou o nome'
                })
            return
        }
        else if (back['Deleted'] === true) {
            ipcRenderer.send('login',
                {
                    'type': 'happy',
                    'message': 'Cliente deletado com sucesso.',
                    'text': "Aperte Ok para continuar"
                })
        }
    }).fail(function () {
        ipcRenderer.send('login',
            {
                'type': 'sad',
                'message': 'Erro na comunicação com o servidor.',
                'text': "Verifique sua conexão com a internet."
            })
    })
}

// Função que adiciona clientes das consultas a tabela

var update_table = function (list_of_clients) {
    $("#customerTable tr").remove()
    list_of_clients.forEach(function (c) {
        $('#customerTable').append('<tr class="table-search"><td>' + c.id + '</td><td>' + c.name + '</td><td>' + c.cpf + '</td></tr>')
    })
}

// Colore a tabela com o elemente clickado
$("table").on('click', 'tr', function () {
    $(this).addClass("selected").siblings().removeClass("selected");
});

// consulta cliente
$("#inputSearch").keyup(function () {
    if ($('#inputSearch').val().length > 2) {
        client_read("Read")
    }
})

// Formata telefone
$("#telephone").keypress(function () {
    format("##-#########", this)
})

// Formata CPF
$("#cpf").keypress(function () {
    format("###.###.###-##", this)
})

// Formata CEP
$("#cep").keypress(function () {
    format("#####-###", this)
})

// Botão de criar cliente
$("#btnCreate").on("click", function (e) {
    client_create()
})

// Botão de ler um cliente
$("#btnRead").on("click", function (e) {
    var client = {}
    client['id'] = $('.selected').find('td:eq(0)').text()
    client['name'] = $('.selected').find('td:eq(1)').text()
    ipcRenderer.send('add-client-to-sale', client)
    win.close()
})

// Botão que checa o input para fazer alteração
$("#btnReadUpdate").on("click", function (e) {
    client_read("Update")
})

// Botão que realiza a alteração
$("#btnUpdate").on("click", function (e) {
    client_update()
})

// Botão de deletar um cliente
$("#btnDelete").on("click", function (e) {
    client_delete()
})

// Chama quando aperta enter
$(".form-control").keypress(function (event) {
    if (event.which == 13) {
        if ($("#btnCreate").length > 0) client_create()
        else if ($("#btnUpdate").length > 0) client_update()
        else if ($("#btnDelete").length > 0) client_delete()
    }
})