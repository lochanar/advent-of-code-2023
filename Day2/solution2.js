const fs = require('node:fs');

try {
    const data = fs.readFileSync('puzzleinput.csv', 'utf8');
    const lines = data.split('\n');
    let sum = 0;
    for (const line of lines) {
        const max = {
            red: 0,
            green: 0,
            blue: 0
        };
        const [_game, setStr] = line.split(':');
        const sets = setStr.split(';');
        for (const set of sets) {
            const pulls = set.split(', ').map((s) => s.trim());
            for (const pull of pulls) {
                const [stringCount, color] = pull.split(' ').map((s) => s.trim());
                const count = parseInt(stringCount);
                if (max[color] < count) {
                    max[color] = count;
                }
            }
        }
        sum += (max.red * max.green * max.blue);
    }
    console.log(sum);
} catch (err) {
    console.error(err)
}