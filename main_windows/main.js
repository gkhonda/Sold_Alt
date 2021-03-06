const electron = require('electron');

// Module to control application life.
const {app, ipcMain, net} = electron;
// Essa a gente que criou
const mainWindow = require('./mainWindow');
const mainWithdraw = require('./mainWithdraw');
const mainAlert = require('./mainAlert');
const mainMenu_admin = require('./mainMenu_admin');
const mainReport = require('./mainReport');
const mainSale = require('./mainSale');
const mainClient = require('./mainClient');
const updater = require('./updater');
const Store = require('./storage.js');

// para mexer com o config file
const ini = require('ini');
const fs = require('fs');
const path = require('path');
const os = require('os');
const async = require("async");
const config_path = path.resolve(__dirname, '..', 'config', 'config.ini');
const config = ini.parse(fs.readFileSync(config_path, 'utf-8'));
const crypto = require('crypto');
const cryptoAlgo = 'aes-128-cbc';
const cryptoPassword = 'soldalt';

// funções de crypto
function encrypt(text) {
    let cipher = crypto.createCipher(cryptoAlgo, cryptoPassword);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted
}

function decrypt(crypted) {
    let decipher = crypto.createDecipher(cryptoAlgo, cryptoPassword);
    let text = decipher.update(crypted, 'hex', 'utf8');
    text += decipher.final('utf8');
    return text
}

// global['default_url'] = 'http://127.0.0.1:8000/';
global['default_url'] = 'http://www.pueristore.com.br/django_sold_alt/';
global['Vendedor'] = '';
global['Vendedor_id'] = 0;
global['is_admin'] = false;
global['Cliente'] = 'Cliente';
global['Cliente_id'] = 0;
global['LojaNome'] = decrypt(config.storeName);
global['LojaCEP'] = decrypt(config.storeCEP);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.on('ready', () => {
    mainWindow.createWindow({'url': 'login.html'});

    // Check for updates after 2 seconds
    setTimeout(updater.check, 2000);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        mainWindow.createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Comunicação login
ipcMain.on('ready', () => {
    mainWindow.createWindow({'url': 'login.html'})
});

// Comunicação popups
ipcMain.on('login', (e, args) => {
    args['url'] = 'popup.html';
    mainAlert.createWindow(args)
});

// Comunicacao menu adm
ipcMain.on('menu_admin', (e, args) => {
    global['Vendedor'] = args['User'];
    global['Vendedor_id'] = args['User_id'];
    global['is_admin'] = true;
    mainMenu_admin.createWindow(args)
});

// Comunicacao menu vendedor
ipcMain.on('menu_not_admin', (e, args) => {
    console.log('Aqui', args['User_id']);
    global['Vendedor'] = args['User'];
    global['Vendedor_id'] = args['User_id'];
    global['is_admin'] = false;
});

// Comunicacao add-client
ipcMain.on('add-client-to-sale', (e, args) => {
    global['Cliente'] = args['name'];
    global['Client_id'] = args['id'];
});

// Tela de criar cliente
ipcMain.on('new-client', (e, args) => {
    mainClient.createWindow({'url': 'client_create.html'})
});

// Tela de venda
ipcMain.on('new-sale', (e, args) => {
    mainSale.createWindow(args)
});

ipcMain.on('new-main-screen', (e, args) => {
    mainWindow.createWindow(args)
});

// Comunicacao menu normal
ipcMain.on('menu', (e, args) => {
    mainWindow.createWindow(args)
});

// Comunicacao menu sangria
ipcMain.on('sangria', (e, args) => {
    mainWithdraw.createWindow({'url': 'withdraw.html'})
});

// Tela pdf
ipcMain.on('pdf', (e, args) => {
    mainReport.createWindow(args);
});

ipcMain.on('update-window', (e, args) => {
    mainWindow.showUrl(args);
});

function getData() {
    const users = new Store({
        configName: 'users',
        defaults: []
    });
    const products = new Store({
        configName: 'products',
        defaults: []
    });
    const clients = new Store({
        configName: 'clients',
        defaults: []
    });

    let buffers = '';

    try {
        const request = net.request(global['default_url'] + 'login/get-all');

        request.on('response', (response) => {
            response.on('data', (chunk) => {
                buffers += chunk
            });
            response.on('end', () => {
                full_response = JSON.parse(buffers);
                users.set(full_response['users']);
                products.set(full_response['products']);
                clients.set(full_response['clients']);

            })
        });
        request.end();
    } catch (e) {
        console.log(e)
    }

}

ipcMain.on('send-json', (e, args) => {
    const clients = new Store({
        configName: 'new_clients',
        defaults: []
    });

    let array_of_clients = clients.get().map(JSON.parse);

    async.each(array_of_clients, function (client, callback) {

        const request = net.request({
            method: 'POST',
            url: global['default_url'] + 'client/create',
        });
        request.write(JSON.stringify(client));

        let buffer = '';

        request.on('response', (response) => {
            response.on('data', (chunk) => {
                buffer += chunk
            });

            response.on('end', () => {
                try {
                    if (JSON.parse(buffer)['Submitted']) {
                        clients.shift(client, 'client');
                    }
                    callback();
                } catch (e) {
                    callback();
                }

            });

            response.on('error', () => {
                callback()
            });
        });

        request.end();
    }, function () {
        console.log('Acabou parte de clientes')
        sendSale();
    });
});

function sendSale() {
    const sales = new Store({
        configName: 'new_sales',
        defaults: []
    });

    let array_of_sales = sales.get().map(JSON.parse);

    async.each(array_of_sales, function (sale, callback) {

        const request = net.request({
            method: 'POST',
            url: global['default_url'] + 'sale/create',
        });
        request.write(JSON.stringify(sale));

        let buffer = '';

        request.on('response', (response) => {
            response.on('data', (chunk) => {
                buffer += chunk
            });

            response.on('end', () => {
                try {
                    if (JSON.parse(buffer)['Submitted']) {
                        sales.shift(sale, 'sale');
                    }
                    callback();
                } catch (e) {
                    callback();
                }

            });

            response.on('error', () => {
                callback()
            });
        });

        request.end();
    }, function () {
        console.log('Acabou a parte de vendas');
        sendOrder();
    });
}

function sendOrder() {
    const orders = new Store({
        configName: 'new_order',
        defaults: []
    });

    let array_of_sales = orders.get().map(JSON.parse);

    async.each(array_of_sales, function (sale, callback) {

        const request = net.request({
            method: 'POST',
            url: global['default_url'] + 'sale/order',
        });
        request.write(JSON.stringify(sale));

        let buffer = '';

        request.on('response', (response) => {
            response.on('data', (chunk) => {
                buffer += chunk
            });

            response.on('end', () => {
                try {
                    if (JSON.parse(buffer)['error'] == false) {
                        orders.shift(sale, 'order');
                    }
                    callback();
                } catch (e) {
                    callback();
                }

            });

            response.on('error', () => {
                callback()
            });
        });

        request.end();
    }, function () {
        console.log('Acabou a parte de encomendas');
        getData();
    });
}
