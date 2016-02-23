'use strict';
const $ = require('jquery');
const remote = require('electron').remote;
//const proc = remote.require('child_process');
var pty = require('pty.js');
var Convert = require('ansi-to-html');
var convert = new Convert();
var _ = require('lodash');
var proc = remote.process;
var stream = require('stream');

var sh = 'D:/msys64/usr/bin/bash.exe';
// sh = 'bash';

proc.stdin.setEncoding('utf8');
//proc.stdout.setEncoding('utf8');
var env = proc.env;

env.PATH += ";D:/msys64/usr/bin/"

var buffer = '';

var terminal = pty.spawn(sh, ['--login'], {
  name: 'xterm-256color',
  cols: 80,
  rows: 25,
  cwd: proc.env.HOME,
  env: env
});

var print = function(c) {
  buffer += String.fromCharCode(c);
  var pre = document.getElementById("terminal");
  pre.innerHTML = buffer;
  document.body.scrollTop = document.body.scrollHeight;
}

var transform = new stream.Transform();

transform._transform = function(chunk, encoding, done) {
  var r = [];
  var i = 0;
  while (i < chunk.length) {
    if (chunk[i] == 27) {
      i++
      var b = chunk[i];
      if (b == '['.charCodeAt(0)) {
        // more than two character sequences
        var csi = '';
        i++;
        while(chunk[i] < 64 || chunk[i] > 126) {
          csi += String.fromCharCode(chunk[i]);
          i++;
        }
        csi += chunk[i];
        //console.log(csi);
      } else if (b >= 64 && b <= 95) {
        // two character escape sequences
      }
    } else {
      // TODO: should process special character like \r, \n
      print(chunk[i]);
    }

    // end
    i++;
  }
  console.log(chunk.toString());
  done();
};

terminal.pipe(transform);

$(document).keypress(function(e) {
  var c = new Buffer([e.keyCode]).toString()
  terminal.write(c);
})


/*
terminal.on('data', function(data) {
  console.log(data);
  buffer += data;
});

terminal.on('end', function(data) {
  console.log('end: ' + data);
  print(buffer);
  buffer = '';
  createPrompt();
})

terminal.write('ls ');

function run(command) {
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
  container.innerHTML = data;
  //container.innerHTML = convert.toHtml(data);
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
*/
