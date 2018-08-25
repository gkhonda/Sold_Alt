const {ipcRenderer} = require('electron')
const {BrowserWindow, getCurrentWindow} = require('electron').remote

$(".sale").on('click', function () {
    ipcRenderer.send('menu', {'url': 'src/html/menu.html'});
    window = getCurrentWindow();
    window.close()
});

$(".admin").on('click', function () {
    ipcRenderer.send('menu', {'url': 'src/html/dashboard.html'});
    window = getCurrentWindow();
    window.close()
});