'use strict';

import {Transform} from 'stream';
const pty = require('pty.js');

import {translate} from './keys.js';
import {TerminalOutput} from './termout.js';

const DummyLineNode = document.createElement('div');
DummyLineNode.className = 'line';
DummyLineNode.style.position = 'absolute';
DummyLineNode.style.visibility = 'hidden';
DummyLineNode.appendChild(document.createElement('span'));
DummyLineNode.appendChild(document.createElement('span'));
DummyLineNode.appendChild(document.createElement('span'));
DummyLineNode.appendChild(document.createElement('span'));
DummyLineNode.children[0].textContent = 'x';
DummyLineNode.children[1].textContent = '我';
DummyLineNode.children[2].textContent = 'ﾊ';
DummyLineNode.children[3].textContent = '세';

export class Terminal extends TerminalOutput {
  constructor(container, font) {
    super();
    this.font = font || "Courier New";
    this.container = container;
    this.screenOffset = 0;
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

    let termLines = this.termLines = document.createElement('div');
    termLines.classList.add('term-lines');
    elem.appendChild(termLines);

    let cursorElement = this.cursorElement = document.createElement('div');
    cursorElement.classList.add('cursor');
    cursorElement.style.left = 0;
    cursorElement.style.top = 0;
    elem.appendChild(cursorElement);

    this.container.appendChild(elem);

    this.measureLineHeightAndCharWidth();
  }

  setupTerminal() {
    this.terminal = pty.spawn(null, [], {
      name: "xterm-256color",
      cols: this.width,
      rows: this.height
    });
    this.terminal.pipe(this);
    this.on('predone', this.render.bind(this))
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

  measureLineHeightAndCharWidth() {
    this.termLines.appendChild(DummyLineNode);
    this.charWidth = DummyLineNode.children[0].getBoundingClientRect().width;
    this.lineHeight = DummyLineNode.getBoundingClientRect().height;
    this.termLines.removeChild(DummyLineNode);
  }

  render() {
    let view = document.createElement('div');
    view.style.position = "absolute";
    view.style.top = -this.screenOffset * this.lineHeight + 'px';
    this.lines.forEach((line) => {
      let lineView = document.createElement('div');
      lineView.style.height = this.lineHeight + 'px';
      if (!line.length) {
        lineView.innerHTML = "&nbsp;"
      } else {
        lineView.innerHTML = new Buffer(line, 'utf8').toString()
          .replace(/ /g, "&nbsp;")
          .replace(/\>/g, "&gt;")
          .replace(/\</g, "&lt;");
      }
      view.appendChild(lineView);
    })
    this.termLines.innerHTML = '';
    this.termLines.appendChild(view);

    this.renderCursor();
  }

  renderCursor() {
    let x = this.cursor.x * this.charWidth;
    let y = (this.cursor.y - this.screenOffset) * this.lineHeight;
    this.cursorElement.style.left = x + 'px';
    this.cursorElement.style.top = y + 'px';
  }

  newLine() {
    super.newLine();
    if (this.cursor.y > this.height) {
      this.screenOffset = this.cursor.y - this.height + 1;
    }
  }

  get width() {
    return Math.floor(this.element.clientWidth / this.charWidth);
  }

  get height() {
    return Math.floor(this.element.clientHeight / this.lineHeight);
  }
}
