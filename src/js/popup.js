require('electron-window').parseArgs()
const {ipcRenderer} = require('electron');

let type = window.__args__['type']
let message = window.__args__['message']
let text = window.__args__['text']
let isConfirmation = window.__args__['confirmation']

$('#div').addClass(type)
$('.btn').addClass(type)

$('#message').text(message)

$('#text').text(text)

$("#default-btn").on('click', function (e) {
    window.close();
})

if (isConfirmation === "True")
{
	$("#default-btn").text("Não").css('background-color', 'red');
	$("#field").prepend("<button class='btn' id='confirmation-btn'>Sim</button>");
	$('#confirmation-btn').css('background-color', 'green');
}

$("#confirmation-btn").on('click', function (e) {
	ipcRenderer.send('ready');
})