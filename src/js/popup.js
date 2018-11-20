const {ipcRenderer} = require('electron');
let hash = window.location.hash.slice(1);
window.__args__ = Object.freeze(JSON.parse(decodeURIComponent(hash)));

let type = window.__args__['type'];
let message = window.__args__['message'];
let text = window.__args__['text'];
let isConfirmation = window.__args__['confirmation'];

$('#div').addClass(type);
$('.btn').addClass(type);

$('#message').text(message);

$('#text').text(text);

$("#default-btn").on('click', function (e) {
    window.close();
});

if (isConfirmation === "True") {
    $("#default-btn").text("Não").css('background-color', 'red');
    $("#field").prepend("<button class='btn' id='confirmation-btn'>Sim</button>");
    $('#confirmation-btn').css('background-color', 'green');
} else if (isConfirmation === "Offline") {
    $("#default-btn").text("Não").css('background-color', 'red');
    $("#field").prepend("<button class='btn' id='offline-btn'>Sim</button>");
    $('#offline-btn').css('background-color', 'green');
}

$("#confirmation-btn").on('click', function (e) {
    ipcRenderer.send('update-window', {'url': 'login.html'});
    window.close();
});

$("#offline-btn").on('click', function (e) {
    ipcRenderer.send('menu_not_admin', {'User': window.__args__['User'], 'User_id': window.__args__['User_id']});
    ipcRenderer.send('update-window', {'url': 'menu.html'});
    window.close();
});

