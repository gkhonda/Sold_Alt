require('electron-window').parseArgs()
const {BrowserWindow, getCurrentWindow} = require('electron').remote

let win, new_win

// Para manipular a Janela Atual
win = getCurrentWindow()

console.log(window.__args__)

$('#sale').on('click', function(e) {
    win.showUrl('src/html/sale.html', '', () => {
      })
})