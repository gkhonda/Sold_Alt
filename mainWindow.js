const {BrowserWindow} = require('electron')

const path = require('path')
const url = require('url')
const window = require('electron-window')

exports.win

exports.createWindow = () => {

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
