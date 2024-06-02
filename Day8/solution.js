const fs = require('node:fs');

try {
    // const data = fs.readFileSync('testinput.csv', 'utf8');
    // const data = fs.readFileSync('testinput2.csv', 'utf8');
    const data = fs.readFileSync('puzzleinput.csv', 'utf8');
    const lines = data.split('\n');
    const instructions = lines[0].split('');
    const tree = {};
    for (let i=2; i<lines.length; i++) {
        const input = lines[i].split(' = ');
        const node = input[0];
        const [left, right] = input[1].replace(/[\(\)\s]+/g, '').split(',');
        tree[node] = {
            L: left,
            R: right
        };
    }
    let node = 'AAA';
    let steps = 0;
    while(node !== 'ZZZ') {
        for (let instruction of instructions) {
            node = tree[node][instruction];
            steps++;
        }
    }
    console.log(steps);
} catch (err) {
    console.error(err);
}