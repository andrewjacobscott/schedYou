const {app, BrowserWindow } = require('electron')


function createWindow(){
  
    //create browser window
    window = new BrowserWindow({width: 2350, height: 1300});

    //load html file
    window.loadFile('index.html');
}

function createButton() {
  newWindow = new BrowserWindow({width: 1000, height: 600});

  //load html file
  newWindow.loadFile('button.html');

}


app.on('ready', createWindow);
