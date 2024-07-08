// Imports
var m = require("mithril");
var t = require("tom-select");
var Data = require("../models/Data");

const confetti = require("canvas-confetti").default;

let app = {
    state: {
        game_index: -1,
        past_guess: [...Array(6).keys()].map(id => ""),
        guess_number: 0,
        complete: false
    },
    history: [],
    current_guess: "",
    data_set: false,
    celebration: false,
    oninit(vnode) {
        
        // Load Data model (composer of the day information)
        Data.loadList();
        
        // Calculate current game_index
        const date = new Date();
        const temp_game_index = Math.floor(date.getTime()/(1000*60*60*24));
    },
    view: function(vnode) {
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
                if (!app.state.past_guess.includes(current_guess) && current_guess != "⨯" && app.state.complete == false) {
                    // Update game state
                    app.current_guess = current_guess;
                    app.state.past_guess[app.state.guess_number] = current_guess;
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
        const temp_state = JSON.parse(localStorage.getItem("state"));
        if (app.state.guess_number == 0 && temp_state) {
            if (temp_state.guess_number > 0 && temp_state.game_id == Data.game_id) {
                app.state = temp_state;
                
            }
        }

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

        // Update labels visibility
        for (i=0; i < app.state.guess_number; i++ ) {
            var label = document.getElementById("label" + i);
            var label_num = document.getElementById("label_num" + i);
            // Display labels
            label.style.opacity = 1;
            label_num.style.opacity = 1;
            label.innerHTML = app.state.past_guess[i];
            if (Data.complete_name == app.state.past_guess[i]) {
                label.classList.add('correct'); 
                label_num.classList.add('correct'); 
                app.state.complete = true;
            }
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
        if (app.state.complete && !app.celebrate) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
            app.celebrate = true;
        }
        app.state.game_id = Data.game_id;
        localStorage.setItem('state', JSON.stringify(app.state));
    }
}
module.exports = app;
