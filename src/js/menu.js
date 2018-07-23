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

$('#sangria').on('click', function(e) {

  // Cria o get request para pegar os produtos
	$.get("http://127.0.0.1:8000/product/read").done(function(back) {
		if (back['Error'] === true)
		{
      console.log('oi')
		}
		else
		{
      console.log(back)
      console.log(back['Product'])
      win.showUrl('src/html/sale.html', back)
		}
	}).fail(function() {
		console.log('fail')
	})
})