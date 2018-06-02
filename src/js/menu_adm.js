const {ipcRenderer} = require('electron')
const {BrowserWindow, getCurrentWindow} = require('electron').remote

$(".sail").on('click', function() {
    ipcRenderer.send('menu', '')
    window = getCurrentWindow()
    window.close()
})