const fs = require('node:fs');

const max = {
    red: 12,
    green: 13,
    blue: 14
};

const isPossible = (color, count) => {
    return count <= max[color];
};

try {
    //const data = fs.readFileSync('testinput.csv', 'utf8');
    const data = fs.readFileSync('puzzleinput.csv', 'utf8');
    const lines = data.split('\n');
    let possible = 0;
    for (const line of lines) {
        const [game, setStr] = line.split(':');
        const gameId = parseInt(game.split(' ')[1]);
        const sets = setStr.split(';');
        possible += gameId;
        for (const set of sets) {
            let impossible = false;
            const pulls = set.split(', ').map((s) => s.trim());
            for (const pull of pulls) {
                const [cnt, color] = pull.split(' ').map((s) => s.trim());
                const count = parseInt(cnt);
                if (!isPossible(color, count)) {
                    possible -= gameId;
                    impossible = true;
                    break;
                }
            }
            if (impossible) {
                break;
            }
        }
    }
    console.log(possible);
} catch (err) {
    console.error(err)
}