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

  if (!inProduction || true) {
    mainWindow.webContents.openDevTools();
    apiDomain = 'http://localhost:3000';
  } else {
    apiDomain = null;
  }

  mainWindow.loadURL(`file://${path.join(
    __dirname,
    '/../', 
    'src/views/auth/login.html', 
  )}`); // index.html?exampleArg=test

  mainWindow.maximize();
  mainWindow.show();

  mainWindow.on('closed', () => (mainWindow = null));
}

function showHomepage() {
  mainWindow.loadURL(`file://${path.join(
    __dirname,
    '/../', 
    'src/views/dashboard.html', 
  )}`);
}
 
function showLogin() {
  mainWindow.loadURL(`file://${path.join(
    __dirname,
    '/../', 
    'src/views/auth/login.html', 
  )}`);
}

ipcMain.on('getApiDomain', () => {
  mainWindow.webContents.send(
    'getApiDomainData', 
    apiDomain,
  );    
});

ipcMain.on('showHomepage', () => {
  showHomepage();
});showLogin

ipcMain.on('showLogin', () => {
  showLogin();
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
