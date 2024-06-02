const fs = require('node:fs');

try {
    // const data = fs.readFileSync('testinput.csv', 'utf8');
    const data = fs.readFileSync('puzzleinput.csv', 'utf8');
    const lines = data.split('\n');
    const times = lines[0].replace(/Time\:\s+/, '').split(/\s+/).map((s) => parseInt(s.trim()));
    const wDistances = lines[1].replace(/Distance\:\s+/, '').split(/\s+/).map((s) => parseInt(s.trim()));
    let margin = 1;

    for (let i=0; i<times.length; i++) {
        const t = times[i];
        const w = wDistances[i];
        let minX = 0;
        for (let x=1; x<t; x++) {
            const d = (t-x)*x;
            
            if (d > w) {
                minX = x;
                break;
            }
        }
        const maxX = t - minX;
        margin *= (maxX - minX + 1);
    }
    console.log(margin);
} catch (err) {
    console.error(err);
}