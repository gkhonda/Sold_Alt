const {BrowserWindow} = require('electron');
const window = require('electron-window');
const fs = require('fs');
const os = require('os');
const path = require('path');
const PDFWindow = require('electron-pdf-window');

exports.win;

exports.createWindow = (args) => {

    const windowOptions = {
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        // fullscreen: true,
    };

    this.win = window.createWindow(windowOptions);

    this.win.webContents.on('did-finish-load', () => {
        // Use default printing options
        this.win.webContents.printToPDF({
            marginsType: 0,
            printBackground: true,
            printSelectionOnly: false,
            landscape: false,
        }, (error, data) => {
            if (error) throw error;
            fs.writeFile('print.pdf', data, (error) => {
                if (error) throw error;
                const winPDF = new PDFWindow({
                    width: 800,
                    height: 600
                });

                winPDF.loadURL(path.resolve(__dirname) + '/../print.pdf');
                // this.win.close();
            })
        })
    });

    // Load main window content
    this.win.showUrl(args['url'], args, () => {
    });

    // Handling closing

    this.win.on('closed', () => {
        this.win = null
    })

};
