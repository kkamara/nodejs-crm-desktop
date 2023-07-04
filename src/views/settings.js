const ipc = window.require('electron').ipcRenderer;
function goToFirstWindow(){
  ipc.send('closeChildWindow');  
}