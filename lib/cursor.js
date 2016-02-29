'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cursor = exports.Cursor = function () {
  function Cursor() {
    _classCallCheck(this, Cursor);

    this.x = 0;
    this.y = 0;
  }

  _createClass(Cursor, [{
    key: 'beginLine',
    value: function beginLine() {
      this.x = 0;
    }
  }, {
    key: 'nextChar',
    value: function nextChar() {
      this.x++;
    }
  }, {
    key: 'newLine',
    value: function newLine() {
      this.x = 0;
      this.y++;
    }
  }, {
    key: 'moveX',
    value: function moveX(x) {
      this.x = x;
    }
  }, {
    key: 'move',
    value: function move(x, y) {
      this.x = x;
      this.y = y;
    }
  }]);

  return Cursor;
}();