'use strice';

import {Writable} from 'stream';
import {Cursor} from './cursor.js';

const LN = '\n'.charCodeAt(0);
const CR = '\r'.charCodeAt(0);

export class TerminalOutput extends Writable {
  constructor() {
    super();
    this.lines = [[]];
    this.line = this.lines[0];
    this.cursor = new Cursor();
  }

  /**
   * Get out put from pty.js
   */
  _write(chunk, encoding, done) {
    console.log(chunk.toString().replace("0x1b", "^[").replace("\r", "\\r"));
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
          let action = String.fromCharCode(c);
          let p = csi;
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

  newChar(c) {
    this.line.push(c);
    this.cursor.nextChar();
  }

  newLine() {
    this.line = [];
    this.lines.push(this.line);
    this.cursor.newLine();
  }

  beginLine() {
    this.cursor.beginLine();
  }
}
