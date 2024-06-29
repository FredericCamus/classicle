// Imports
var m = require("mithril");
var t = require("tom-select");
var Data = require("../models/Data");

let app = {
    past_guess: [],
    current_guess: "",
    data_set: false,
    oninit: Data.loadList,
    view: function(vnode) {
        let name = m(".card", m(".card-content", [
            m("h1", Data.complete_name),
        ]));
        let clue_pieces = m(".card", m(".card-content", [
            m("h3", "Popular Pieces"),
            m("ul", m("li", Data.works.map((work) => m("li", work.title))))
        ]));
        let clue_birth = m(".card", m(".card-content", [
            m("h3", "Birth"),
            m("p",Data.birth),
            m("h3", "Period"),
            m("p", Data.epoch),
        ]));
        let clue_portrait = m(".card", m(".card-content", [
            m("img", {"src":Data.portrait,"alt":"Composer Image"})
        ]));
        
        let grid = m(".grid", [name, clue_birth, clue_pieces, clue_portrait]);
        
        let select = 
            m('select', 
                { id: 'composer-select', placeholder: "Composer...", autocomplete: "off" },
                Data.composers.map((composer, index) => m("option", {value: index}, composer))
            );
        
        let button = m("button", {"class": "btn btn-primary"}, "click me");
        let form = m("form", {
            onsubmit: function (e) { 
                e.preventDefault();
                app.current_guess = e.target.value;
            }},  [select, button]);

        let container = m(".container", grid);

        return m("div", [container, form, m("p", "hello world" + app.current_guess)]);
    },
    onupdate: function(vnode) {
        // Initialize Tom Select on the input element
        if (Data.composers != 0 && app.data_set == false) {
            new t('#composer-select', {
                plugins: ['clear_button'],
                create: false,
                sortField: {
                    field: "text",
                    direction: "asc"
                }
            });
            app.data_set = true;
        }
    }
}
module.exports = app;
