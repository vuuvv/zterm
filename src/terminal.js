'use strict';

import {Transform} from 'stream';
const pty = require('pty.js');

import {translate} from './keys.js';

const LN = '\n'.charCodeAt(0);
const CR = '\r'.charCodeAt(0);

export class Terminal extends Transform {
  constructor(container, font) {
    super();
    this.font = font || "Courier New";
    this.container = container;
    this.cursor = { x: 0, y: 0 };
    this.lines = [[]];
    this.setupElement();
    this.setupTerminal();
  }

  setupElement() {
    let elem = this.element = document.createElement('div');
    elem.style.fontFamily = this.font;
    elem.classList.add('term-view');
    elem.addEventListener('keydown', this.keydown.bind(this));
    elem.addEventListener('keypress', this.keypress.bind(this));
    elem.setAttribute('tabindex', "1");

    let fontMeasurer = this.fontMeasurer = document.createElement('div');
    fontMeasurer.classList.add('font-measurer');
    fontMeasurer.innerHTML = "A";
    elem.appendChild(fontMeasurer);

    this.container.appendChild(elem);
  }

  setupTerminal() {
    this.terminal = pty.spawn(null, [], {
      name: "xterm-256color",
      cols: this.width,
      rows: this.height
    });
    this.terminal.pipe(this);
  }

  send(chunk) {
    this.terminal.write(chunk);
  }

  keydown(e) {
    let key = translate(e);
    if (key === false) {
      return true;
    }
    this.send(key);
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  keypress(e) {
    let c = String.fromCharCode(e.keyCode);
    this.send(c);
    return false;
  }

  _transform(chunk, encoding, done) {
    console.log(chunk.toString().replace("0x1b", "^[").replace("\r", "\\r"));
    let lines = this.lines;
    let line = lines[lines.length - 1];
    let i = 0;
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
    this.render();
    done();
  }

  render() {
    let view = document.createElement('div');
    view.style.position = "absolute";
    view.style.bottom = "0";
    this.lines.forEach((line) => {
      let lineView = document.createElement('div');
      lineView.innerHTML = new Buffer(line, 'utf8').toString()
        .replace(/ /g, "&nbsp;")
        .replace(/\>/g, "&gt;")
        .replace(/\</g, "&lt;");
      view.appendChild(lineView);
    })
    this.element.innerHTML = '';
    this.element.appendChild(view);
  }

  get charWidth() {
    return this.fontMeasurer.clientWidth;
  }

  get charHeight() {
    return this.fontMeasurer.clientHeight;
  }

  get width() {
    return Math.floor(this.element.clientWidth / this.charWidth);
  }

  get height() {
    return Math.floor(this.element.clientHeight / this.charHeight);
  }
}
