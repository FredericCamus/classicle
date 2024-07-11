// Imports
var m = require("mithril");
var Game = require("./views/Game");

var header = {
	view: function () {
		return m("h1", "Classicle");
	}
}
m.mount(document.body, Game);
