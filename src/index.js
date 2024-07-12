// Imports
var m = require("mithril");
var Game = require("./views/Game");
var Stats = require("./views/Stats");
var Layout = require("./views/Layout");

// m.route.prefix = "";

const path = window.location.search.slice(1) || "/";

console.log("DEBUG", window.location.search.slice(1) || "/");

m.route(document.body, "/classicle", {
    "/classicle": {
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

