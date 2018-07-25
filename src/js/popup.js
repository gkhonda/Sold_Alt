require('electron-window').parseArgs()

let type = window.__args__['type']
let message = window.__args__['message']
let text = window.__args__['text']

$('#div').addClass(type)
$('.btn').addClass(type)

$('#message').text(message)

$('#text').text(text)

$("button").on('click', function (e) {
    window.close();
})
