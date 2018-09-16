const window = require('electron-window');

exports.win;

exports.showUrl = (args) => {
    this.win.showUrl(args['url'], args, () => {});
};

exports.createWindow = (args) => {

    const windowOptions = {
        width: 1300,
        height: 800,
        minWidth: 1100,
        minHeight: 600,
        autoHideMenuBar: true,
        fullscreen: false,
    };

    this.win = window.createWindow(windowOptions);

    // Load main window content
    this.win.showUrl(args['url'], args, () => {});

    // Handling closing 

    this.win.on('closed', () => {
        this.win = null
    })

};
