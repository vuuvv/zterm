'use strict';

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var mainWindow = null;

app.on('window-all-close', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function () {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.loadUrl('file://' + __dirname + '/../dist/index.html');
  mainWindow.webContents.openDevTools();
  mainWindow.on('close', function () {
    mainWindow = null;
  });
});