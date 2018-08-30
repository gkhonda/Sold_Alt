const {BrowserWindow} = require('electron');

const path = require('path');
const url = require('url');
const window = require('electron-window');

exports.win;

exports.createWindow = (args) => {

    const windowOptions = {
        width: 1300,
        height: 800,
        minWidth: 1100,
        minHeight: 600,
        autoHideMenuBar: true,
        // fullscreen: true,
    };

    this.win = window.createWindow(windowOptions);

    // Load main window content
    this.win.showUrl(args['url'], args, () => {
    });

    // Handling closing 

    this.win.on('closed', () => {
        this.win = null
    })

};
