'use strict';
const Transform = require('stream').Transform;

/**
 *
 */
class Input extends Transform {
  _transform(chunk, encoding, done) {
    console.log(chunk);
    done();
  }
}

module.exports = Input;
