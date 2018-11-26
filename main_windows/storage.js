const electron = require('electron');
const path = require('path');
const jsonfile = require('jsonfile')
const fs = require('fs');

class Store {
    constructor(opts) {
        // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
        // app.getPath('userData') will return a string of the user's app data directory path.
        const userDataPath = (electron.app || electron.remote.app).getPath('userData') + '/SoldAltStorage';

        if (!fs.existsSync(userDataPath)) {
            fs.mkdirSync(userDataPath);
        }

        // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
        this.path = path.join(userDataPath, opts.configName + '.json');

        this.data = parseDataFile(this.path, opts.defaults);
    }

    // This will just return the property on the `data` object
    get() {
        try {
            return JSON.parse(fs.readFileSync(this.path)).map(JSON.stringify);
        } catch (e) {
            return;
        }

    }

    set(array) {
        jsonfile.writeFileSync(this.path, array, {spaces: 2, EOL: '\r\n'})
    }

    update(obj) {
        let jsonArray;
        try {
            jsonArray = this.get().map(JSON.parse);
            // Nao apagar esse console.log ele faz funcionar o em todos os casos
            console.log(jsonArray.length)
        } catch (e) {
            jsonfile.writeFileSync(this.path, []);
            jsonArray = this.get().map(JSON.parse);
        }
        jsonArray.push(obj);
        jsonfile.writeFileSync(this.path, jsonArray, {spaces: 2, EOL: '\r\n'})
    }

    shift(obj, opt) {
        try {
            let jsonArray = this.get().map(JSON.parse);
            if (jsonArray.length) {
                let index;
                switch (opt) {
                    case 'client':
                        index = jsonArray.findIndex(i => (i.name === obj.name && i.cpf === obj.cpf));
                        break;
                    case 'sale':
                        index = jsonArray.findIndex(i => (i.sale_details.CPFCliente === obj.sale_details.CPFCliente && i.sale_details.Total === obj.sale_details.Total));
                        break;
                    case 'order':
                        index = jsonArray.findIndex(i => (i.Total === obj.Total && i.CPFCliente === obj.CPFCliente));
                        break;
                }

                console.log(index);
                console.log(obj.name);
                if (index != -1){
                    jsonArray.splice(index, 1);
                }
            }
            jsonfile.writeFileSync(this.path, jsonArray, {spaces: 2, EOL: '\r\n'})
        } catch (e) {

        }
    }
}

function parseDataFile(filePath, defaults) {
    // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
    // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
        // if there was some kind of error, return the passed in defaults instead.
        return defaults;
    }
}

// expose the class
module.exports = Store;