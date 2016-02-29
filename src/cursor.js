'use strict';

export class Cursor {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  beginLine() {
    this.x = 0;
  }

  nextChar() {
    this.x++;
  }

  newLine() {
    this.x = 0;
    this.y++;
  }

  moveX(x) {
    this.x = x;
  }

  move(x, y) {
    this.x = x;
    this.y = y;
  }
}
