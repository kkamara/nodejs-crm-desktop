const { contextBridge, ipcRenderer, } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'api', {
        send: (channel, data) => {
            // whitelist channels
            const validChannels = [
                'openChildWindow', 
                'closeChildWindow',
                'showHomepage',
                'showLogin',
                'getApiDomain',
                'getLogin',

            ];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            const validChannels = ['getApiDomainData', 'getLoginData',];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
    },
);