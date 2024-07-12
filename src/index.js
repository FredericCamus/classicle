// Imports
var m = require("mithril");
var Game = require("./views/Game");
var Stats = require("./views/Stats");
var Layout = require("./views/Layout");

m.route.prefix = "";

m.route(document.body, "/game", {
    "/game": {
        render: function() {
            return m(Layout, m(Game));
        }
    },
    "/stats": {
        render: function(vnode) {
            return m(Layout, m(Stats))
        }
    },
})

