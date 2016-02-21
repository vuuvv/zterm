'use strict';
const $ = require('jquery');
const remote = require('electron').remote;
const proc = remote.require('child_process');

console.log(remote);

var execute = function(input) {
  let args = input.split(/\s+/);
  let command = args.shift();
  var response = proc.spawnSync(command, args);
  return response.stdout.toString();
}

var createPrompt = function() {
  $('.currentInput').removeClass('currentInput');

  var newInput = document.createElement("input");
  newInput.type = "text";
  newInput.name = "amount";
  $(newInput).addClass('currentInput');
  $("#board").append(newInput);
  newInput.focus();
  addEnterHander();
}

var addEnterHander = function() {
  $('.currentInput').keypress(function(e) {
    if (e.which == 13) {
      print($('.currentInput').val());
      createPrompt();
      return false;
    }
  });
};

var print = function(command) {
  var container = document.createElement("pre");
  container.className += "currentInput";
  container.innerHTML = escapeHtml(execute(command));
  $("#board").append(container);
}

var escapeHtml = function(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

createPrompt();