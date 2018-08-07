const {BrowserWindow} = require('electron');

const path = require('path');
const url = require('url');
const window = require('electron-window');

exports.win;

exports.createWindow = (args) => {

    const windowOptions = {
        width: 1000,
        height: 450,
        // minWidth: 1000,
        // minHeight: 600,
        autoHideMenuBar: true,
        // frame: false,
    };

    this.win = window.createWindow(windowOptions);

    this.win.showUrl('src/html/withdraw.html', '', () => {
    });
    // Handling closing

    this.win.on('closed', () => {
        this.win = null
    })

};