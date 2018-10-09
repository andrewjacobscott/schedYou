const {app, BrowserWindow } = require('electron')
const path = require('path');
const url = require('url');


let win;

// Create browser window
function createWindow(){
    win = new BrowserWindow({width: 2350, height: 1300, icon:__dirname+'/img/icon.png'});

    // Load index.html
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

// Open devtools [COMMENT THIS ONE LINE OUT WHEN YOU DONT NEED DEVTOOLS OPENED AT START]
win.webContents.openDevTools();
  win.on('closed', ()=> {
    win = null;
  })
}

// Run create window function
app.on('ready', createWindow);


//Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin'){
    app.quit();
  }
})
