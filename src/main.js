'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('window-all-close', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
})

app.on('ready', () => {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadUrl('file://' + __dirname + '/../dist/index.html');
  mainWindow.webContents.openDevTools();
  mainWindow.on('close', function() {
    mainWindow = null;
  })
})
