var m = require("mithril")

module.exports = {
    view: function(vnode) {
        const about_icon = m("img.navicon", {src: "./assets/question.png", alt: "About"});
        const classicle_icon = m("img.logo", {src: "./assets/logo.png", alt: "CLASSICLE"});
        const stats_icon = m("img.navicon", {src: "./assets/stats.png", alt: "Statistics"});
        return m("main.layout", [
            m("nav.menu", [
                m(m.route.Link, {href: "/about"}, about_icon),
                m(m.route.Link, {href: "/classicle"}, classicle_icon),
                m(m.route.Link, {href: "/stats"}, stats_icon)
            ]),
            m("hr"),
            m("section", vnode.children)
        ])
    }
}
