const electron  = require('electron');
const { ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;


const public_dir = process.env.PUBLIC_URL || "./public";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Init cache file
    if (!fs.existsSync(public_dir + "/data/cache.json"))
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

    // Choose between localhost or build/index.html
    const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../build/index.html')}`;
    mainWindow.loadURL(startUrl);


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



ipcMain.on('symLinkCreate', (event, document) => {
    const childProcess = require('child_process');
    
    childProcess.spawnSync("ln", ["-s", document, `./public/links/${document.split('\\').pop().split('/').pop()}.ln`]);

    event.returnValue = `./links/${document.split('\\').pop().split('/').pop()}.ln`;
})

ipcMain.on('reload', (event) => {
    mainWindow.reload();
    // event.returnValue = true;
})