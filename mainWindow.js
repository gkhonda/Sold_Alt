const {BrowserWindow} = require('electron')

const path = require('path')
const url = require('url')
const window = require('electron-window')

exports.win

exports.createWindow = (url_) => {

    const windowOptions = {
        width: 1200,
        height: 1000,
        minWidth: 350,
        minHeight: 300,
        autoHideMenuBar: true,
        // fullscreen: true,
    }

    this.win = window.createWindow(windowOptions)

    // Load main window content
    this.win.showUrl(url_, '', () => {
        console.log('the window should be showing with the contents of the URL now')
    })


    // Handling closing 

    this.win.on('closed', () => {
        this.win = null
    })

}
