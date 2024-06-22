// src/models/User.js
var m = require("mithril")

var Composer = {
    current: "",
    info: {},
    works: [],
    composers: [],
    loadList: function() {
        max = 200;
        id = Math.floor(Math.random() * max);
        return m.request({
            method: "GET",
            url: `https://api.openopus.org/work/list/composer/${id}/genre/Recommended.json`,
            withCredentials: false
        })
        .then(function(result) {
            Composer.info = result.composer;
            Composer.works = result.works;
        })
    }
}

module.exports = Composer
