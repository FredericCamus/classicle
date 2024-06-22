var m = require("mithril")

var List = {
    composers: [],
    loadList: function() {
       return fetch('data.txt')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network error: ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                List.composers = data.split("\n");
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
}

module.exports = List
