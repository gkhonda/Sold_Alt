const {BrowserWindow} = require('electron')

const path = require('path')
const url = require('url')
const window = require('electron-window')

exports.win 

exports.createWindow = (args) => {

    const windowOptions = {
        width: 128,
        height: 256,
        autoHideMenuBar: true,
        frame : false,
        }

    this.win = window.createWindow(windowOptions)


    this.win.showUrl('src/html/menu_admin.html', args, () => {
        console.log('the window should be showing with the contents of the URL now')
    })
    // Handling closing 

    this.win.on('closed', () => {
        this.win = null
    })

}