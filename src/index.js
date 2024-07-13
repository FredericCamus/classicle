// Imports
var m = require("mithril");
var Game = require("./views/Game");
var Stats = require("./views/Stats");
var Layout = require("./views/Layout");

// m.route.prefix = "";

let path = window.location.pathname.slice(1) || "/";

if (!(path in ["/classicle/", "/", "/stats"]) ) { path = "/"; }

m.route(document.body, path, {
    "/classicle/": {
        render: function() {
            return m(Layout, m(Game));
        }
    },
    "/": {
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

