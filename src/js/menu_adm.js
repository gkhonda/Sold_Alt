const {ipcRenderer} = require('electron')

$(".sail").on('click', function() {
    ipcRenderer.send('menu', '')
})