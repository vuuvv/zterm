'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.translate = translate;
var browserKeyMap = [];
// 0~9
browserKeyMap[48] = '0';
browserKeyMap[49] = '1';
browserKeyMap[50] = '2';
browserKeyMap[51] = '3';
browserKeyMap[52] = '4';
browserKeyMap[53] = '5';
browserKeyMap[54] = '6';
browserKeyMap[55] = '7';
browserKeyMap[56] = '8';
browserKeyMap[57] = '9';

// A-Z
browserKeyMap[65] = 'A';
browserKeyMap[66] = 'B';
browserKeyMap[67] = 'C';
browserKeyMap[68] = 'D';
browserKeyMap[69] = 'E';
browserKeyMap[70] = 'F';
browserKeyMap[71] = 'G';
browserKeyMap[72] = 'H';
browserKeyMap[73] = 'I';
browserKeyMap[74] = 'J';
browserKeyMap[75] = 'K';
browserKeyMap[76] = 'L';
browserKeyMap[77] = 'M';
browserKeyMap[78] = 'N';
browserKeyMap[79] = 'O';
browserKeyMap[80] = 'P';
browserKeyMap[81] = 'Q';
browserKeyMap[82] = 'R';
browserKeyMap[83] = 'S';
browserKeyMap[84] = 'T';
browserKeyMap[85] = 'U';
browserKeyMap[86] = 'V';
browserKeyMap[87] = 'W';
browserKeyMap[88] = 'X';
browserKeyMap[89] = 'Y';
browserKeyMap[90] = 'Z';

// other printable keys
browserKeyMap[188] = ",";
browserKeyMap[190] = ".";
browserKeyMap[186] = ";";
browserKeyMap[222] = "\"";
browserKeyMap[219] = "{";
browserKeyMap[221] = "}";
browserKeyMap[192] = "`";
browserKeyMap[220] = "\\";
browserKeyMap[189] = "-";
browserKeyMap[187] = "=";
browserKeyMap[193] = "ろ";
browserKeyMap[255] = "￥";

// function keys
browserKeyMap[16] = "Shift";
browserKeyMap[17] = "Ctrl";
browserKeyMap[18] = "Alt";
browserKeyMap[20] = "CapsLock";
browserKeyMap[91] = "OSLeft";
browserKeyMap[92] = "OSRight";
browserKeyMap[93] = "ContextMenu";
browserKeyMap[13] = "Enter";
browserKeyMap[32] = "Space";
browserKeyMap[8] = "Backspace";
browserKeyMap[9] = "Tab";
browserKeyMap[46] = "Delete";
browserKeyMap[35] = "End";
browserKeyMap[36] = "Home";
browserKeyMap[45] = "Insert";
browserKeyMap[34] = "PageDown";
browserKeyMap[33] = "PageUp";
browserKeyMap[40] = "ArrowDown";
browserKeyMap[37] = "ArrowLeft";
browserKeyMap[39] = "ArrowRight";
browserKeyMap[38] = "ArrowUp";
browserKeyMap[27] = "Escape";
browserKeyMap[44] = "PrintScreen";
browserKeyMap[145] = "ScrollLock";
browserKeyMap[19] = "Pause";

// F1~F24
browserKeyMap[112] = 'F1';
browserKeyMap[113] = 'F2';
browserKeyMap[114] = 'F3';
browserKeyMap[115] = 'F4';
browserKeyMap[116] = 'F5';
browserKeyMap[117] = 'F6';
browserKeyMap[118] = 'F7';
browserKeyMap[119] = 'F8';
browserKeyMap[120] = 'F9';
browserKeyMap[121] = 'F10';
browserKeyMap[122] = 'F11';
browserKeyMap[123] = 'F12';
browserKeyMap[124] = 'F13';
browserKeyMap[125] = 'F14';
browserKeyMap[126] = 'F15';
browserKeyMap[127] = 'F16';
browserKeyMap[128] = 'F17';
browserKeyMap[129] = 'F18';
browserKeyMap[130] = 'F19';
browserKeyMap[131] = 'F20';
browserKeyMap[132] = 'F21';
browserKeyMap[133] = 'F22';
browserKeyMap[134] = 'F23';
browserKeyMap[135] = 'F24';

// number pad
browserKeyMap[96] = 'Numpad0';
browserKeyMap[97] = 'Numpad1';
browserKeyMap[98] = 'Numpad2';
browserKeyMap[99] = 'Numpad3';
browserKeyMap[100] = 'Numpad4';
browserKeyMap[101] = 'Numpad5';
browserKeyMap[102] = 'Numpad6';
browserKeyMap[103] = 'Numpad7';
browserKeyMap[104] = 'Numpad8';
browserKeyMap[105] = 'Numpad9';
browserKeyMap[144] = 'NumLock';
browserKeyMap[107] = 'NumpadAdd';
browserKeyMap[194] = 'NumpadComma';
browserKeyMap[110] = 'NumpadDecimal';
browserKeyMap[111] = 'NumpadDivide';
browserKeyMap[12] = 'NumpadEqual';
browserKeyMap[106] = 'NumpadMultiply';
browserKeyMap[109] = 'NumpadSubtract';

function char(code) {
  return String.fromCharCode(code);
}

var esc = char(0x1b);

function ctrl(code) {
  if (typeof code == "string") {
    return char(code.charCodeAt(0) & 0x1f) + code.substr(1);
  }
  return char(code & 0x1f);
}

function alt(code) {
  if (typeof code == "string") {
    return esc + code;
  }
  return esc + char(code);
}

function ctrlAlt(code) {
  return alt(ctrl(code));
}

var termKeyConfig = [
// [keyname, code, printable, ctrl-code, alt-code, shift-code]
['0', '0', true], ['1', '1', true], ['2', '2', true], ['3', '3', true], ['4', '4', true], ['5', '5', true], ['6', '6', true], ['7', '7', true], ['8', '8', true], ['9', '9', true], ['A', 'A', true], ['B', 'B', true], ['C', 'C', true], ['D', 'D', true], ['E', 'E', true], ['F', 'F', true], ['G', 'G', true], ['H', 'H', true], ['I', 'I', true], ['J', 'J', true], ['K', 'K', true], ['L', 'L', true], ['M', 'M', true], ['N', 'N', true], ['O', 'O', true], ['P', 'P', true], ['Q', 'Q', true], ['R', 'R', true], ['S', 'S', true], ['T', 'T', true], ['U', 'U', true], ['V', 'V', true], ['W', 'W', true], ['X', 'X', true], ['Y', 'Y', true], ['Z', 'Z', true], [',', ',', true], ['.', '.', true], [';', ';', true], ['"', '"', true], ['{', '{', true], ['}', '}', true], ['`', '`', true], ['\\', '\\', true], ['-', '-', true], ['=', '=', true], ['ろ', 'ろ', true], ['￥', '￥', true],

//name           , code        , printable , c          , a          , s          , c-a , c-s , a-s , c-a-s
['Enter', char(0x0d), false, '', '', '', '', '', ''], ['Space', char(0x20), false, '', '', '', '', '', ''], ['Tab', char(0x09), false, '', '', '', '', '', ''], ['Backspace', char(0x7f), false, char(0x1f), char(0x17), char(0x08), '', '', ''], ['Delete', alt("[3~"), false, '', '', '', '', '', ''], ['End', alt("[F"), false, '', '', '', '', '', ''], ['Home', alt("[H"), false, '', '', '', '', '', ''], ['Insert', alt("[2~"), false, '', '', '', '', '', ''], ['PageDown', alt("[6~"), false, '', '', '', '', '', ''], ['PageUp', alt("[5~"), false, '', '', '', '', '', ''], ['ArrowUp', alt("[A"), false, '', '', '', '', '', ''], ['ArrowDown', alt("[B"), false, '', '', '', '', '', ''], ['ArrowRight', alt("[C"), false, '', '', '', '', '', ''], ['ArrowLeft', alt("[D"), false, '', '', '', '', '', ''], ['Escape', char(0x1b), false, '', '', '', '', '', ''],
//['PrintScreen' , char()      , false     , ''         , ''         , ''         , ''  , ''  , ''] ,
//['ScrollLock'  , char()      , false     , ''         , ''         , ''         , ''  , ''  , ''] ,
['Pause', char(0x1d), false, '', '', '', '', '', '']];

var termKeyMap = {};

termKeyConfig.forEach(function (item) {
  termKeyMap[item[0]] = item;
});

var ATTR = {
  NAME: 0,
  CODE: 1,
  PRINTABLE: 2,
  C: 3,
  A: 4,
  S: 5,
  "C-A": 6,
  "C-S": 7,
  "A-S": 8,
  "C-A-S": 8
};

function _key(code) {
  return browserKeyMap[code];
}

function translate(key) {
  var keyCode = key.keyCode;
  var keyname = _key(keyCode);
  if (!keyname) {
    return false;
  }
  var termkey = termKeyMap[keyname];
  if (termkey) {
    if (termkey[ATTR.PRINTABLE] && !key.ctrlKey && !key.altKey) {
      return false;
    }
    var code = termkey[ATTR.CODE];
    var modify = [];
    if (key.ctrlKey) {
      modify.push("C");
    }
    if (key.altKey) {
      modify.push("A");
    }
    if (key.shiftKey) {
      modify.push("S");
    }
    modify = modify.join("-");
    console.log(modify, keyname);
    if (!modify) {
      return code;
    }

    var ret = termkey[ATTR[modify]];
    if (ret) {
      return ret;
    }
    switch (modify) {
      case 'C':
        return ctrl(code);
      case 'A':
        return alt(code);
      case 'C-A':
        return ctrlAlt(code);
    }
  }
  return false;
}