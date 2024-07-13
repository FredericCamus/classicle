// Imports
const m = require("mithril");

let app = {
    view: function(vnode) {
        const hr = m("hr");
        const part0 = 
                m(m.route.Link, {href: "/classicle"}, m("p", "<- back"));
        const part1 = 
            [
                m("h1", "How to play"), 
                m("p", "Try to guess the classical composer of the day in 6 guesses!"),
                m("p", "After each of the first few guesses, a new clue will be revealed.")
            ];
        const part2 = 
            [
                m("h1", "How was this made"), 
                m("p", 
                    [
                        "Inspired by the geography guessing game ", 
                        m("a", {href: "https://worldle.teuteuf.fr/"}, "Worldle"),
                        "."
                    ]
                ),
                m("p", 
                    [
                        "This app is built with the ",
                        m("a", {href: "https://mithril.js.org/"}, "Mithril"),
                        " javascript framework and uses data retrieved from the wonderful ", 
                        m("a", {href: "https://github.com/openopus-org/openopus_api"}, "Open Opus"),
                        " dataset."
                    ]
                )
            ];


        return m("div", {style: "text-align: left"}, [part1, hr, part2, hr]);
    }
}

module.exports = app;
