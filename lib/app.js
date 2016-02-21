'use strict';

var $ = require('jquery');
var remote = require('electron').remote;
var proc = remote.require('child_process');

console.log(remote);

var execute = function execute(input) {
  var args = input.split(/\s+/);
  var command = args.shift();
  var response = proc.spawnSync(command, args);
  return response.stdout.toString();
};

var createPrompt = function createPrompt() {
  $('.currentInput').removeClass('currentInput');

  var newInput = document.createElement("input");
  newInput.type = "text";
  newInput.name = "amount";
  $(newInput).addClass('currentInput');
  $("#board").append(newInput);
  newInput.focus();
  addEnterHander();
};

var addEnterHander = function addEnterHander() {
  $('.currentInput').keypress(function (e) {
    if (e.which == 13) {
      print($('.currentInput').val());
      createPrompt();
      return false;
    }
  });
};

var print = function print(command) {
  var container = document.createElement("pre");
  container.className += "currentInput";
  container.innerHTML = escapeHtml(execute(command));
  $("#board").append(container);
};

var escapeHtml = function escapeHtml(unsafe) {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
};

createPrompt();