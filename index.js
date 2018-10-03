const {app, BrowserWindow } = require('electron')



function createWindow(){
    //create browser window
    window = new BrowserWindow({width: 2350, height: 1300});

    //load html file
    window.loadFile('index.html');
}

app.on('ready', createWindow);