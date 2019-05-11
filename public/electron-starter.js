const electron  = require('electron');
const fs = require('fs');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {

    // const stats = fs.lstatSync("./public/data/cache.json");
    if (!fs.existsSync("./public/data/cache.json"))
    {
        const cache = {
            openFile: "",
            recentFiles: [],
            maxRecentFiles: 10,
            pagesToDisplay: 1
        }

        fs.writeFile('./public/data/cache.json', JSON.stringify(cache), function (err) {
            if (err) throw err;
            console.log('Created cache!');
        });
    }

    // Create the browser window.
    mainWindow = new BrowserWindow({ 
        webPreferences: {
            nodeIntegration: true
        },
        width: 800,
        height: 600,
        show: false 
    });
    mainWindow.maximize();
    mainWindow.setMenuBarVisibility(false);
    mainWindow.show();

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../build/index.html')}`;
    console.log(startUrl);
    mainWindow.loadURL(startUrl);

    // mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
    // mainWindow.loadURL('http://localhost:3000');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});


const { ipcMain } = require('electron');
ipcMain.on('symLinkCreate', (event, document) => {
    const childProcess = require('child_process');
    
    childProcess.spawnSync("ln", ["-s", document, `./public/links/${document.split('\\').pop().split('/').pop()}.ln`]);

    event.returnValue = `./links/${document.split('\\').pop().split('/').pop()}.ln`;
})

ipcMain.on('reload', (event) => {
    mainWindow.reload();
    // event.returnValue = true;
})