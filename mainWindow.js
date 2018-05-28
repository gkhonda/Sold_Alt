const {BrowserWindow} = require('electron')

const path = require('path')
const url = require('url')
const window = require('electron-window')

exports.win

exports.createWindow = () => {
<<<<<<< HEAD

    const windowOptions = {
        width: 1000,
        height: 800,
        minWidth: 350,
        minHeight: 300,
        autoHideMenuBar: true,
    }

    this.win = window.createWindow(windowOptions)

    // Load main window content
    this.win.showUrl('src/html/login.html', '', () => {
        console.log('the window should be showing with the contents of the URL now')
    })


    // Handling closing 

    this.win.on('closed', () => {
        this.win = null
    })

}
=======
  this.win = new BrowserWindow({
    // useContentSize: true,
    width: 1000,
    height: 800,
    minWidth: 350,
    minHeight: 300,
    autoHideMenuBar: true
  })

  this.win.webContents.on('did-finish-load', () => {
    this.win.webContents.send('toLogin', "Hello, renderer.")
  })


  // DevTools
  // this.win.webContents.openDevTools()

  console.log(url.format({
    pathname: path.join(__dirname, 'renderer/login.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Load main window content
  this.win.loadURL(url.format({
    pathname: path.join(__dirname, 'src/html/login.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Handling closing

  this.win.on('closed', () => {
    this.win = null
  })

}
>>>>>>> 032e547d080d8592001500057dd51e1a0f221354
