fs = require('fs');
const {dialog} = require('electron').remote;

$('#btnChooser').on('click', function () {
    dialog.showOpenDialog((fileNames) => {
        if (fileNames === undefined) {
            console.log("Nenhum arquivo selecionado.")
        }

        fs.readFile(fileNames[0], "utf-8", (err, data) => {
            if (err) {
                console.log('Cannot read')
            } else {

                if (fileNames[0].slice(-5) !== '.xlsx' && fileNames[0].slice(-4) !== '.csv') {
                    alert("Opa, excel ou csv");
                } else {

                }
            }
        })
    })
});

// $('.upload-container').ondragstart = (event) => {
//     event.preventDefault();
//     ipcRenderer.send('ondragstart', '/path/to/item')
// };