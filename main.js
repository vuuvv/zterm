'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var mainWindow = null;

app.on('window-all-close', function() => {
  if (process.platform != 'darwin') {
    app.quit();
  }
})

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.webContents.openDevTools();
  mainWindow.on('close', function() {
    mainWindow = null;
  })
})
