const {BrowserWindow} = require('electron')

const path = require('path')
const url = require('url')

exports.win

exports.createWindow = () => {
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
