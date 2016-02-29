'use strict';
'use strice';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TerminalOutput = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stream = require('stream');

var _cursor = require('./cursor.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LN = '\n'.charCodeAt(0);
var CR = '\r'.charCodeAt(0);

var TerminalOutput = exports.TerminalOutput = function (_Writable) {
  _inherits(TerminalOutput, _Writable);

  function TerminalOutput() {
    _classCallCheck(this, TerminalOutput);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TerminalOutput).call(this));

    _this.lines = [[]];
    _this.line = _this.lines[0];
    _this.cursor = new _cursor.Cursor();
    return _this;
  }

  /**
   * Get out put from pty.js
   */


  _createClass(TerminalOutput, [{
    key: '_write',
    value: function _write(chunk, encoding, done) {
      console.log(chunk.toString().replace("0x1b", "^[").replace("\r", "\\r"));
      var i = 0;
      while (i < chunk.length) {
        var c = chunk[i];
        if (c == 27) {
          c = chunk[++i];
          if (c == '['.charCodeAt(0)) {
            // more than two character sequences
            var csi = '';
            c = chunk[++i];
            while (c < 64 || c > 126) {
              csi += String.fromCharCode(c);
              c = chunk[++i];
            }
            var action = String.fromCharCode(c);
            var p = csi;
            csi += String.fromCharCode(c);
            if (csi == '2K') {
              this.line.length = 0;
            } else if (action == 'G') {
              this.cursor.moveX(Math.max(0, parseInt(p) - 1));
            }
            //console.log(csi);
          } else if (c >= 64 && c <= 95) {
              // two character escape sequences
            }
        } else {
            // TODO: should process special character like \r, \n
            if (c === LN) {
              this.newLine();
            } else if (c === CR) {
              this.beginLine();
            } else {
              this.newChar(c);
            }
          }
        // end
        i++;
      }
      this.emit('predone');
      done();
    }
  }, {
    key: 'newChar',
    value: function newChar(c) {
      this.line.push(c);
      this.cursor.nextChar();
    }
  }, {
    key: 'newLine',
    value: function newLine() {
      this.line = [];
      this.lines.push(this.line);
      this.cursor.newLine();
    }
  }, {
    key: 'beginLine',
    value: function beginLine() {
      this.cursor.beginLine();
    }
  }]);

  return TerminalOutput;
}(_stream.Writable);