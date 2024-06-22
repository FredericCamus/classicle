// src/index.js
var m = require("mithril")

var UserList = require("./views/UserList")
var ComposerForm = require("./views/ComposerForm")
var Layout = require("./views/Layout")

m.mount(document.body, UserList)

// m.route(document.body, "/list", 
//     {
//         "/list": {
//             render: function() {
//                 return m(Layout, m(UserList))
//             }
//         },
//         "/edit/:id": {
//             render: function(vnode) {
//                 return m(Layout, m(UserForm, vnode.attrs))
//             }
//         },
//     })
