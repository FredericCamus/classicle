var m = require("mithril")

module.exports = {
    view: function(vnode) {
        return m("main.container1", [
            m("nav.menu", [
                m(m.route.Link, {href: "/"}, "About"),
                m(m.route.Link, m("img", {source: "/assets/favicon.ico", alt: "classicle"})),
                m(m.route.Link, {href: "/stats"}, "Stats")
            ]),
            m("hr", {style: "width: 100%; opacity: 50%;"}),
            m("section", vnode.children)
        ])
    }
}
