const fs = require('node:fs');

const expandRange = (destination, source, range, array, name) => {
    array.push({
        name: name,
        source: [source, source + range - 1],
        destination: [destination, destination + range - 1]
    });
}

const findInMap = (x, map) => {
    if (x >= map.source[0] && x <= map.source[1]) {
        // console.log("found", x, map);
        return x - map.source[0] + map.destination[0];
    }
    return -1;
}

try {
    // const data = fs.readFileSync('testinput.csv', 'utf8');
    const data = fs.readFileSync('puzzleinput.csv', 'utf8');
    const lines = data.split('\n');
    const seeds = lines[0].split(':')[1].trim().split(/\s+/).map((s) => s.trim());

    const arrays = [];
    let name = '';

    for (let i=1; i<lines.length; i++) {
        if (lines[i] === '') {
            continue;
        }
        if (lines[i].endsWith('map:')) {
            name = lines[i];
            arrays.push([]);
            continue;
        }
        const [destination, source, range] = lines[i].split(/\s+/).map((s) => parseInt(s.trim()));
        expandRange(destination, source, range, arrays[arrays.length - 1], name);
    }
    // console.log(JSON.stringify(arrays, null, 2));
    let minLocation = Number.MAX_SAFE_INTEGER;
    const names = ["soil", "fertilizer", "water", "light", "temperature", "humidity", "location"];
    for (const seed of seeds) {
        let x = seed;
        let i = 0;
        // console.log("seed", x)
        for (const array of arrays) {
            for (const map of array) {
                const m = findInMap(x, map);
                x = m < 0 ? x : m;
                if (m >= 0) {
                    break;
                }
            }
            // console.log(names[i++], x);
        }
        if (x < minLocation) {
            minLocation = x;
        }
        // console.log(seed, x);
    }
    console.log(minLocation);
} catch (err) {
    console.error(err);
}