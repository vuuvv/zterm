'use strict';

var _term = require("./term");

var t = new _term.Terminal(document.body);
t.send("set HOME=\r");
t.send("set INPUTRC=\r");
t.send("D:/msys64/usr/bin/bash.exe --login -i\r");
//t.send("clear\r");

/*
const $ = require('jquery');
const remote = require('electron').remote;
//const proc = remote.require('child_process');
var pty = require('pty.js');
var proc = remote.process;

var stream = require('stream');
var Input = require('./input');
var keys = require('./keys');

var sh = 'D:/msys64/usr/bin/bash.exe';
// sh = 'bash';

proc.stdin.setEncoding('utf8');
//proc.stdout.setEncoding('utf8');
var env = proc.env;

//env.PATH += ";D:/msys64/usr/bin/"

var buffer = [];

var fCaculator = document.getElementById("font-size-caculator")

console.log(fCaculator.clientWidth);
console.log(fCaculator.clientHeight);

var terminal = window.terminal = pty.spawn("cmd.exe", [], {
  name: 'xterm-256color',
  cols: Math.floor(window.innerWidth / fCaculator.clientWidth),
  rows: Math.floor(window.innerHeight / fCaculator.clientHeight),
});

terminal.write("set HOME=\r")
terminal.write("set INPUTRC=\r")
terminal.write(sh + " --login -i\r");

terminal.writeCode = function() {
  terminal.write(new Buffer(arguments), "buffer");
}

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
  console.log(chunk.toString().replace("0x1b", "^[").replace("\r", "\\r"))
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
  done();
};

terminal.pipe(transform);

$(document).keypress(function(e) {
  var c = new Buffer([e.keyCode]).toString()
  console.log("0x" + e.keyCode.toString(16));
  terminal.write(c);
  return true;
})

$(document).keydown(function(e) {
  var key = keys.translate(e);
  if (key === false) {
    return true;
  }
  terminal.write(key);
  return false;
});
*/