// Imports
var m = require("mithril");
var t = require("tom-select");
var Data = require("../models/Data");

const confetti = require("canvas-confetti").default;

let app = {
    state: {
        past_guess: [...Array(6).keys()].map(id => ""),
        guess_number: 0,
        complete: false
    },
    current_guess: "",
    data_set: false,
    oninit: Data.loadList,
    view: function(vnode) {
        console.log(Data.complete_name);
        let name = m(".card", {id: "card_name"}, m(".card-content", {id: "content_name"},
            m("h1", Data.complete_name)));
        let clue_pieces = m(".card", {id: "card_pieces"}, m(".card-content", {id: "content_pieces"}, [
            m("h2", "POPULAR PIECES"),
            m("ul", m("li", Data.works.map((work) => m("li", work.title))))
        ]));
        let clue_birth = m(".card", {id: "card_birth"}, m(".card-content", {id: "content_birth"},[
            m("h2", "PERIOD"),
            m("p", Data.epoch),
            m("h2", "BIRTH"),
            m("p",Data.birth)
        ]));
        let clue_portrait = m(".card", {id: "card_portrait"}, m(".card-content", {id: "content_portrait"}, [
            m("img", {"src":Data.portrait,"alt":"Composer Image"})
        ]));
        let grid = m(".grid", [name, clue_birth, clue_pieces, clue_portrait]);

        let select = 
            m('select', 
                { id: 'composer-select', placeholder: "Composer...", autocomplete: "off" },
                [m("option", {"value": ""}, "Select a composer...")]
                .concat(Data.composers.map((composer, index) => m("option", {value: index}, composer)))
            );

        let button = m("button", {"class": "btn btn-primary"}, "🎺 GUESS");

        let container = m(".container", grid);

        let form = m("form", {
            onsubmit: function (e) { 
                // Prevent default
                e.preventDefault();

                // Get select element
                let select_element = document.getElementById('composer-select');
                let current_guess = select_element.form.innerText.split("\n")[0];
                if (!app.state.past_guess.includes(current_guess) && current_guess != "⨯" && app.state.guess_number < 6) {
                    let guess_number = app.state.guess_number;
                    var label = document.getElementById("label" + guess_number);
                    var label_num = document.getElementById("label_num" + guess_number);

                    // Display labels
                    label.style.opacity = 1;
                    label_num.style.opacity = 1;

                    if (Data.complete_name == current_guess) {
                        label.classList.toggle('correct'); 
                        label_num.classList.toggle('correct'); 
                        document.getElementById("content_name").style.opacity = 1;
                        app.state.complete = true;
                    }

                    // Update game state
                    app.current_guess = current_guess;
                    app.state.past_guess[guess_number] = current_guess;
                    app.state.guess_number += 1;
                }

            }}, m(".container_form", [select, button]));

        // Boxes represent success or failure of player guesses.
        let container_guesses = m(".container_form",
            app.state.past_guess.map((name, index) => 
                [
                    m("label", {id: "label"+index}, name), 
                    m("label", {id: "label_num"+index}, (index+1) + " / 6")
                ]
            )
        );

        return m("div", [container, form, container_guesses]);
    },
    onupdate: function(vnode) {
        // Initialize Tom Select on the input element
        // once the data has been loaded
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

        // Show game clues based on game state
        if (app.state.complete || app.state.guess_number >= 1) {
            document.getElementById("content_birth").style.opacity = 1;
        }
        if (app.state.complete || app.state.guess_number >= 2) {
            document.getElementById("content_pieces").style.opacity = 1;
        }
        if (app.state.complete || app.state.guess_number >= 3) {
            document.getElementById("content_portrait").style.opacity = 1;
        }
        if (app.state.complete || app.state.guess_number >= 6) {
            document.getElementById("content_name").style.opacity = 1;
            app.state.complete = true;
        }
        if (app.state.complete) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
        }
    }
}
module.exports = app;
