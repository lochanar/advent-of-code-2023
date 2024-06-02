const fs = require('node:fs');

try {
    // const data = fs.readFileSync('testinput.csv', 'utf8');
    const data = fs.readFileSync('puzzleinput.csv', 'utf8');
    const lines = data.split('\n');
    let sum = 0;
    for (let line of lines) {
        const extrapolation = [];
        const readings = line.split(/\s+/g).map((s) => parseInt(s.trim()));
        extrapolation.push(readings);
        // console.log(line, readings, extrapolation);
        let i = 0;
        while (Math.max(extrapolation[i]) !== 0 && Math.min(extrapolation[i]) !== 0) {
            let allZero = true;
            extrapolation.push([]);
            for (let j=1; j<extrapolation[i].length; j++) {
                const diff = extrapolation[i][j] - extrapolation[i][j-1];
                if (diff !== 0) {
                    allZero = false;
                }
                extrapolation[i+1].push(diff);
            }
            if (allZero) {
                break;
            }
            i++;
        }
        for (let e=extrapolation.length - 1; e > 0; e--) {
            const lastElement = extrapolation[e][extrapolation[e].length-1];
            const nextLastElement = extrapolation[e-1][extrapolation[e-1].length-1];
            const x = lastElement + nextLastElement;
            extrapolation[e-1].push(x);
        }
        const e = extrapolation[0];
        sum += e[e.length-1];
        // console.log(extrapolation);
    }
    console.log(sum);
} catch (err) {
    console.error(err);
}