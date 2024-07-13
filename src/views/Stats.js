// Imports
const m = require("mithril");
const MAX_GUESS = 6;

function get_distribution(list) {
    let d = [...Array(MAX_GUESS + 1).keys()].map(id => 0);
    for (i=0; i < list.length; i++) {
        d[list[i]] += 1;
    }
    return d;
}

function get_streak(list) {
    let streak = 0;
    for (i=list.length-1; i >= 0; i--) {
        if (list[i] > 0) streak += 1;
        else break;
    }
    return streak;
}

function max_streak(list) {
    let streak = 0;
    let max_streak = 0;
    let index = list.length-1;
    while (index > 0) {
        for (i=index; i >= 0; i--) {
            index = i-1;
            if (list[i] > 0) {
                streak += 1;
                max_streak = Math.max(max_streak, streak);
            } else {
                streak = 0;
                break;
            }
        }
    }
    return max_streak;
}

let app = {
    dist: [],
    hist: [],
    oninit(vnode) {
        // Load player history
        app.hist = JSON.parse(localStorage.getItem("history")) || [];

        // Get distribution of guesses
        app.dist = get_distribution(app.hist);

    },
    view: function(vnode) {
        const sum_wins = app.dist.slice(1).reduce((acc, i) => acc+i, 0);
        const sum_all = app.dist.slice(0).reduce((acc, i) => acc+i, 0);
        
        // Statistics
        const win_rate = Math.round(100*(sum_wins/sum_all), 2) || 0;
        const losses = sum_all - sum_wins;
        const streak = get_streak(app.hist);
        const m_streak = max_streak(app.hist);

        // Display
        const title_stat = m("h3", "Statistics");
        const list_stat = m(".container3", 
            [
                m("h3.stat_title", "Played:"),
                m("h3.stat_content", `${sum_all}`),
                m("h3.stat_title", "Win Rate:"),
                m("h3.stat_content", `${win_rate}%`),
                m("h3.stat_title", `Current Streak:`),
                m("h3.stat_content", `${streak}`),
                m("h3.stat_title", `Max Streak:`),
                m("h3.stat_content", `${m_streak}`),
            ]
        );

        // Only consider wins
        const wins_dist = app.dist.slice(1);

        // Get max_elem to normalise
        const max_elem = wins_dist.reduce((acc, i) => Math.max(acc, i), 0);

        // Guess Distribution
        const title_dist = m("h3", "Guess Distribution");
        const list_dist = m("ol", wins_dist.map(n => 
            m(
                "li.container2", 
                {style: `width: ${(n/max_elem)*80}%;`}, 
                n
            )
        ));

        const container1 = m("div", [title_stat, list_stat, title_dist, list_dist]);
        return container1;
    }
}
module.exports = app;
