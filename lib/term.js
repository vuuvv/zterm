'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Terminal = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _stream = require('stream');

var _keys = require('./keys.js');

var _termout = require('./termout.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pty = require('pty.js');

var DummyLineNode = document.createElement('div');
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

var Terminal = exports.Terminal = function (_TerminalOutput) {
  _inherits(Terminal, _TerminalOutput);

  function Terminal(container, font) {
    _classCallCheck(this, Terminal);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Terminal).call(this));

    _this.font = font || "Courier New";
    _this.container = container;
    _this.screenOffset = 0;
    _this.setupElement();
    _this.setupTerminal();
    return _this;
  }

  _createClass(Terminal, [{
    key: 'setupElement',
    value: function setupElement() {
      var elem = this.element = document.createElement('div');
      elem.style.fontFamily = this.font;
      elem.classList.add('term-view');
      elem.addEventListener('keydown', this.keydown.bind(this));
      elem.addEventListener('keypress', this.keypress.bind(this));
      elem.setAttribute('tabindex', "1");

      var termLines = this.termLines = document.createElement('div');
      termLines.classList.add('term-lines');
      elem.appendChild(termLines);

      var cursorElement = this.cursorElement = document.createElement('div');
      cursorElement.classList.add('cursor');
      cursorElement.style.left = 0;
      cursorElement.style.top = 0;
      elem.appendChild(cursorElement);

      this.container.appendChild(elem);

      this.measureLineHeightAndCharWidth();
    }
  }, {
    key: 'setupTerminal',
    value: function setupTerminal() {
      this.terminal = pty.spawn(null, [], {
        name: "xterm-256color",
        cols: this.width,
        rows: this.height
      });
      this.terminal.pipe(this);
      this.on('predone', this.render.bind(this));
    }
  }, {
    key: 'send',
    value: function send(chunk) {
      this.terminal.write(chunk);
    }
  }, {
    key: 'keydown',
    value: function keydown(e) {
      var key = (0, _keys.translate)(e);
      if (key === false) {
        return true;
      }
      this.send(key);
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, {
    key: 'keypress',
    value: function keypress(e) {
      var c = String.fromCharCode(e.keyCode);
      this.send(c);
      return false;
    }
  }, {
    key: 'measureLineHeightAndCharWidth',
    value: function measureLineHeightAndCharWidth() {
      this.termLines.appendChild(DummyLineNode);
      this.charWidth = DummyLineNode.children[0].getBoundingClientRect().width;
      this.lineHeight = DummyLineNode.getBoundingClientRect().height;
      this.termLines.removeChild(DummyLineNode);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var view = document.createElement('div');
      view.style.position = "absolute";
      view.style.top = -this.screenOffset * this.lineHeight + 'px';
      this.lines.forEach(function (line) {
        var lineView = document.createElement('div');
        lineView.style.height = _this2.lineHeight + 'px';
        if (!line.length) {
          lineView.innerHTML = "&nbsp;";
        } else {
          lineView.innerHTML = new Buffer(line, 'utf8').toString().replace(/ /g, "&nbsp;").replace(/\>/g, "&gt;").replace(/\</g, "&lt;");
        }
        view.appendChild(lineView);
      });
      this.termLines.innerHTML = '';
      this.termLines.appendChild(view);

      this.renderCursor();
    }
  }, {
    key: 'renderCursor',
    value: function renderCursor() {
      var x = this.cursor.x * this.charWidth;
      var y = (this.cursor.y - this.screenOffset) * this.lineHeight;
      this.cursorElement.style.left = x + 'px';
      this.cursorElement.style.top = y + 'px';
    }
  }, {
    key: 'newLine',
    value: function newLine() {
      _get(Object.getPrototypeOf(Terminal.prototype), 'newLine', this).call(this);
      if (this.cursor.y > this.height) {
        this.screenOffset = this.cursor.y - this.height + 1;
      }
    }
  }, {
    key: 'width',
    get: function get() {
      return Math.floor(this.element.clientWidth / this.charWidth);
    }
  }, {
    key: 'height',
    get: function get() {
      return Math.floor(this.element.clientHeight / this.lineHeight);
    }
  }]);

  return Terminal;
}(_termout.TerminalOutput);