// Imports
const m = require("mithril");
const t = require("tom-select");
const confetti = require("canvas-confetti").default;
const Data = require("../models/Data");

let app = {
    state: {
        past_guess: [...Array(6).keys()].map(id => ""),
        guess_number: 0,
        complete: false
    },
    history: [],
    data_set: false,
    celebration: false,
    oninit(vnode) {
        
        // Load Data model (composer of the day information)
        Data.loadList();

        // Load player history
        app.history = JSON.parse(localStorage.getItem("history")) || [];
    },
    view: function(vnode) {
        let name = m(".card", {id: "card_name"}, m(".card-content", {id: "content_name"},
            m("h1", Data.complete_name)));
        
        let clue_pieces = m(".card", {id: "card_pieces"}, m(".card-content", {id: "content_pieces"}, [
            m("h2", "POPULAR PIECES"),
            m("ul", {style: "text-align: left"}, m("li", Data.works.map((work) => m("li", work.title))))
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

        let form = m("form", {
            onsubmit: function (e) { 
                // Prevent default
                e.preventDefault();

                // Get select element
                let select_element = document.getElementById('composer-select');
                let current_guess = select_element.form.innerText.split("\n")[0];

                // Do not allow:
                // - Repeat guesses
                // - Guesses without a valid composer
                // - Guesses after the game has finished
                if (!app.state.past_guess.includes(current_guess) && current_guess != "⨯" && !app.state.complete) {
                    // Update game state
                    app.state.past_guess[app.state.guess_number] = current_guess;
                    app.state.guess_number += 1;

                    // If the first guess is made, create a new history record
                    if (app.state.guess_number == 1) {
                        app.history.push(0);

                        // Store player history
                        localStorage.setItem('history', JSON.stringify(app.history));
                    }

                    // If player has guesses the composer name, update history, and complete game
                    // Otherwise, if past max guesses, complete game without celebration
                    if (Data.complete_name == current_guess) {
                        app.history[app.history.length-1] = app.state.guess_number;
                        app.state.complete = true;

                        // Store player history
                        localStorage.setItem('history', JSON.stringify(app.history));
                    }
                    else if (app.state.guess_number >= 6) {
                        app.state.complete = true;
                        app.celebration = true;
                    }

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
        
        return m("div", [grid, form, container_guesses]);
    },    
    onremove: function(vnode) {
        // Delete tom-select instance when changing page
        if (vnode.state.tomSelectInstance) {
            vnode.state.tomSelectInstance.destroy();
            vnode.state.tomSelectInstance = null;
            app.data_set = false;
        }
    },
    onupdate: function(vnode) {
        // Determine whether to use past game state
        const temp_state = JSON.parse(localStorage.getItem("state"));

        // Don't use past game is current game has started or temp_state is null
        if (app.state.guess_number == 0 && temp_state) {
            // Use past game state if a guess was made, and the composer is up to date 
            if (temp_state.guess_number > 0 && temp_state.game_id == Data.game_id) {
                app.state = temp_state;

                // If the past game was complete, disable celebration
                if (app.state.complete == true)
                    app.celebration = true;
            }
        }

        // Initialize Tom Select on the input element
        // once the data has been loaded
        if (Data.composers != 0 && app.data_set == false) {
            vnode.state.tomSelectInstance = new t('#composer-select', {
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

            // Check if one of the guesses is correct
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
        }
        if (app.state.complete && !app.celebration) {
            // Confetti celebration centre screen
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });

            // Dissalow celebrating twice
            app.celebration = true;
        }
        app.state.game_id = Data.game_id;
        localStorage.setItem('state', JSON.stringify(app.state));
    }
}
module.exports = app;
