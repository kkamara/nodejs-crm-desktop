const electron = require('electron');
const app = electron.app;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const setupPug = require('electron-pug');

const inProduction = app.isPackaged;

let mainWindow;
let childWindow;
const preload = path.join(
    __dirname, 
    '../',
    'preload.js',
);

async function createWindow() {
    try {
        await setupPug({pretty: true}, { appName: 'Desktop Multi-Window App', })
    } catch (err) {
        throw new Error('Could not initiate \'electron-pug\`: '+err.message);
    }
    
    mainWindow = new BrowserWindow({ 
        width: 900, 
        height: 680, 
        webPreferences: {
            preload,
            devTools: inProduction ? false : true,
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: true,
        },
        show: false,
     });

     if (!inProduction) {
        mainWindow.webContents.openDevTools();
     }

    mainWindow.loadURL(`file://${path.join(
        __dirname, 
        '../', 
        'src/views/index.pug', // index.pug?exampleArg=test
    )}`);

    mainWindow.maximize();
    mainWindow.show();

    mainWindow.on('closed', () => (mainWindow = null));
}

// Function to create child window of parent one
function createChildWindow() {
    childWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        modal: true,
        show: false,
        parent: mainWindow,
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: true,
        },
    });
    
    childWindow.loadURL(`file://${path.join(
        __dirname, 
        '../', 
        'src/views/settings.pug',
    )}`);
    
    childWindow.once('ready-to-show', () => {
      childWindow.show();
    });
}

ipcMain.on('openChildWindow', (event, arg) => {
    createChildWindow();
});

ipcMain.on('closeChildWindow', (event, arg) => {
    childWindow.close();
    // win.webContents.send("openChildWindow", responseObj);
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
