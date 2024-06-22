// Imports
var m = require("mithril");
var t = require("tom-select");
var Data = require("../models/Data");

let app = {
    data_set: false,
    oninit: Data.loadList,
    view: function(vnode) {
        let select = 
            m('select', 
                { id: 'composer-select', placeholder: "Composer...", autocomplete: "off" },
                Data.composers.map((composer, index) => m("option", {value: index}, composer))
            );
        let clues = m(".clues", 
            [
                m("h1", Data.complete_name),
                m(".row2",
                    [  
                        m(".column", 
                            [
                                m("h3", "Popular Pieces"),
                                m("ul", m("li", Data.works.map((work) => m("li", work.title)))),
                                m("h3", "Birth"),
                                m("p",Data.birth),
                                m("h3", "Period"),
                                m("p", Data.epoch),
                            ]),
                        m(".column", m("img", {"src":Data.portrait,"alt":"Composer Image"}))
                    ]
                )
            ]
        );
        let main = m("main", clues, select);
        return main;
    },
    onupdate: function(vnode) {
        // Initialize Tom Select on the input element
        if (Data.composers != 0 && app.data_set == false) {
            new t('#composer-select', {
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
