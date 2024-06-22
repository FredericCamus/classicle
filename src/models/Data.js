var m = require("mithril")


// Get n works, prioritising popular works
function get_works(works, n) {
    popular = composer.works.filter((work) => work.popular == "1");
    non_popular = composer.works.filter((work) => work.popular == "0");
    l = popular.length;
    return popular.slice(0, n).concat(non_popular.slice(0, Math.max(n-l, 0)));
}

var Data = {
    composers: [],
    complete_name: "",
    epoch: "",
    birth: "",
    portrait: "",
    works: [],
    loadList: function() {
        fetch('data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network error: ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                // Parse data
                composers = JSON.parse(data);
                
                // Pick a random composer
                rand_id = Math.floor(Math.random() * composers.length);
                composer = composers[rand_id];

                // Set list of all composer names
                Data.composers = composers.map((c) => c.complete_name);

                // Set composer information
                Data.complete_name = composer.complete_name;
                Data.epoch = composer.epoch;
                Data.birth = composer.birth;
                Data.portrait = composer.portrait;
                Data.works = get_works(composer.works, 5);
                m.redraw();
            });
    }
}

module.exports = Data;
