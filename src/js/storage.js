const {dialog} = require('electron').remote;
const {getCurrentWindow} = require('electron').remote;
const {ipcRenderer} = require('electron');
const remote = require('electron').remote;
const FormData = require('form-data');
const fs = require('fs');

let win;

// Para manipular a Janela Atual
win = getCurrentWindow();

var file;
var type;

// Manipulação do DOM
btnChooser = $('#btnChooser');
textContainer = $('#text-container');
imgContainer = $('#img-container');
downloadSheet = $('#downloadSheet');
submitBtn = $('#submit-btn');

downloadSheet.on('click', function () {
    win.showUrl(remote.getGlobal('default_url') + 'sale/read');
});

btnChooser.on('click', function () {
    dialog.showOpenDialog((fileNames) => {
        if (fileNames === undefined) {
            return
        }

        fs.readFile(fileNames[0], "utf-8", (err) => {
            if (err) {
                console.log('Cannot read')
            } else {

                if (fileNames[0].slice(-5) !== '.xlsx' && fileNames[0].slice(-4) !== '.csv') {
                    ipcRenderer.send('login',
                        {
                            'type': 'ok-face',
                            'message': 'Verifique seu arquivo!',
                            'text': 'Ele deve ser um .csv ou um excel (.xlsx)!'
                        });
                } else if (fileNames[0].slice(-5) === '.xlsx'){
                    type = 'excel';
                    file = fileNames[0];
                    imgContainer.attr('src','../../public/images/excel.png');
                    textContainer.text(fileNames[0]);
                    textContainer.addClass('small');
                    btnChooser.text("⇧");
                    btnChooser.addClass("block");
                } else if (fileNames[0].slice(-4) === '.csv') {
                    type = 'csv';
                    file = fileNames[0];
                    imgContainer.attr('src','../../public/images/excel.png');
                    textContainer.text(fileNames[0]);
                    textContainer.addClass('small');
                    btnChooser.text("⇧");
                    btnChooser.addClass("block");
                }
            }
        })
    })
});

submitBtn.on('click', function () {

    if (file === undefined) {
        ipcRenderer.send('login',
            {
                'type': 'ok-face',
                'message': 'Adicione um arquivo!',
                'text': 'Não esqueça de adicionar o arquivo.'
            });
        return;
    }

    var form = new FormData();
    form.append('type', type);
    form.append('store', 1);
    form.append('my_buffer', new Buffer(10));
    form.append('sample_sheet', fs.createReadStream(file));

    console.log(form);
    form.submit(remote.getGlobal('default_url') + 'store_product/getdata', function(err, res) {
        if (err) {
            ipcRenderer.send('login',
                {
                    'type': 'sad',
                    'message': 'Erro na conexão!',
                    'text': 'Verifique a internet.'
                });
            return
        }
        if(res.statusCode === 400) {
            ipcRenderer.send('login',
                {
                    'type': 'ok-face',
                    'message': 'Verifique seu arquivo!',
                    'text': 'Ele deve estar igual, tanto no tamanho, ordem e nos ids. Mude apenas a quantidade!'
                });
            return
        }
        ipcRenderer.send('login',
            {
                'type': 'happy',
                'message': 'Sucesso',
                'text': 'Estoque modificado com sucesso!'
            });
    });

});