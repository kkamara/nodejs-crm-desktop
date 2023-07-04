const ipc = window.require('electron').ipcRenderer;
function goToSettingsWindow() {
  ipc.send('openChildWindow');
}