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

var buffer = [];

var fCaculator = document.getElementById("font-size-caculator")

console.log(fCaculator.clientWidth);
console.log(fCaculator.clientHeight);

var terminal = pty.spawn(sh, ['--login'], {
  name: 'xterm-256color',
  cols: Math.floor(window.innerWidth / fCaculator.clientWidth),
  rows: Math.floor(window.innerHeight / fCaculator.clientHeight),
  cwd: proc.env.HOME,
  env: env
});

var print = function(lines) {
  //buffer = buffer.concat(c);
  var html = "";
  lines.forEach(function(line) {
    html += new Buffer(line, 'utf8').toString();
  });
  var pre = document.getElementById("terminal");
  pre.innerHTML = html;
  document.body.scrollTop = document.body.scrollHeight;
}


var tCount = 0;
var transform = new stream.Transform();

const LN = '\n'.charCodeAt(0);
const CR = '\r'.charCodeAt(0);

var lines = [[]];

transform._transform = function(chunk, encoding, done) {
  var i = 0;
  var line = lines[lines.length - 1];
  while (i < chunk.length) {
    let c = chunk[i];
    if (c == 27) {
      c = chunk[++i];
      if (c == '['.charCodeAt(0)) {
        // more than two character sequences
        var csi = '';
        c = chunk[++i];
        while(c < 64 || c > 126) {
          csi += String.fromCharCode(c);
          c = chunk[++i];
        }
        csi += String.fromCharCode(c);
        if (csi == '2K') {
          lines[lines.length - 1] = line = [];
        }
        //console.log(csi);
      } else if (c >= 64 && c <= 95) {
        // two character escape sequences
      }
    } else {
      // TODO: should process special character like \r, \n
      if (c === LN) {
        // new line
        line.push(c);
        line = [];
        lines.push(line);
      } else if (c === CR) {
        // lines[lines.length - 1] = line = [];
      } else {
        line.push(c);
      }
    }

    // end
    i++;
  }

  print(lines);
  //console.log(chunk.toString());
  console.log((tCount++) + '*****************************************************')
  done();
};

terminal.pipe(transform);

$(document).keypress(function(e) {
  var c = new Buffer([e.keyCode]).toString()
  terminal.write(c);
  return true;
})

$(document).keydown(function(e) {
  var key;
  switch (e.keyCode) {
    case 8:
      // backspace
      key = '\x17';
      break;
    default:
      return true;
  }
  var c = new Buffer([e.keyCode]).toString()
  terminal.write(c);
  return false;
});


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
