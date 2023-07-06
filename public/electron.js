const electron = require('electron');
const path = require('path');

const app = electron.app;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;

const inProduction = app.isPackaged;

let mainWindow = null;
let apiDomain = null;
const preload = path.join(
    __dirname, 
    '../',
    'preload.js',
);

async function createWindow() {
    const api = {
        config: { appName: 'Desktop Multi-Window App', },
        title: 'Dashboard',
        session: {
            page: {
                title: 'Dashboard', 
            },
            auth: {
                name: 'Jane Doe',
                lastLogin: '2023-07-03 16:40:00',
                permissions: [
                    'view client',
                    'create client',
                    'view user',
                    'create user',
                    'view log',
                    'create log',
                ], 
            },
        },
    };
    
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
        apiDomain = 'http://localhost:3000';
    } else {
        apiDomain = null;
    }

    mainWindow.loadURL(`file://${path.join(
        __dirname, 
        '/views/home.html', // index.html?exampleArg=test
    )}`);

    mainWindow.maximize();
    mainWindow.show();

    mainWindow.on('closed', () => (mainWindow = null));
}

ipcMain.on('getApiDomain', () => {
    mainWindow.webContents.send(
        'getApiDomainData', 
        apiDomain,
    );    
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
