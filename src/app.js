'use strict';
const $ = require('jquery');
const remote = require('electron').remote;
//const proc = remote.require('child_process');
var pty = require('pty.js');
var Convert = require('ansi-to-html');
var convert = new Convert();
var _ = require('lodash');
var proc = remote.process;

var sh = 'D:\\msys64\\usr\\bin\\bash.exe';
// sh = 'bash';

proc.stdin.setEncoding('utf8');
//proc.stdout.setEncoding('utf8');

var buffer = '';

function run(command) {
  var terminal = pty.spawn(sh, ['--login', '-c', '-i', command], {
    name: 'xterm-256color',
    cols: 120,
    rows: 80,
    cwd: proc.env.HOME,
    env: proc.env
  });

  terminal.on('data', function(data) {
    buffer += data;
  });

  terminal.on('end', function(data) {
    print(buffer);
    buffer = '';
    createPrompt();
  })
}

var createPrompt = function() {
  $('.currentInput').removeClass('currentInput');

  var newInput = document.createElement("input");
  newInput.type = "text";
  $(newInput).addClass('currentInput');
  $("#board").append(newInput);
  newInput.focus();
  addEnterHander();
}

var addEnterHander = function() {
  $('.currentInput').keypress(function(e) {
    if (e.which == 13) {
      run($('.currentInput').val());
      return false;
    }
  });
};

var print = function(data) {
  var container = document.createElement("pre");
  container.className += "currentInput";
  container.innerHTML = convert.toHtml(data);
  $("#board").append(container);
}

var escapeHtml = function(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

createPrompt();
