const fs = require('node:fs');

try {
    // const data = fs.readFileSync('testinput.csv', 'utf8');
    const data = fs.readFileSync('puzzleinput.csv', 'utf8');
    const lines = data.split('\n');
    const time = parseInt(lines[0].replace(/Time\:\s+/, '').replace(/\s+/g, ''));
    const wDistance = parseInt(lines[1].replace(/Distance\:\s+/, '').replace(/\s+/g, ''));
    let margin = 1;

    const t = time;
    const w = wDistance;
    let minX = 0;
    for (let x=1; x<t; x++) {
        const d = (t-x)*x;
        
        if (d > w) {
            minX = x;
            break;
        }
    }
    const maxX = t - minX;
    margin = (maxX - minX + 1);
    console.log(margin);
} catch (err) {
    console.error(err);
}