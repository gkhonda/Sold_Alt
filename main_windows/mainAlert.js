const window = require('electron-window');

exports.win;

exports.createWindow = (args) => {

    const windowOptions = {
        width: 500,
        height: 400,
        minWidth: 350,
        minHeight: 300,
        autoHideMenuBar: true,
        frame: false,
    };

    this.win = window.createWindow(windowOptions);

    this.win.showUrl('src/html/popup.html', args, () => {
    });

    // Handling closing
    this.win.on('closed', () => {
        this.win = null
    })

};