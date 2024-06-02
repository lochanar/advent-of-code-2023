const fs = require('node:fs');
const OS = require('os')

process.env.UV_THREADPOOL_SIZE = OS.cpus().length;

const expandRange = (destination, source, range, array, name) => {
    array.push({
        name: name,
        source: [source, source + range - 1],
        destination: [destination, destination + range - 1]
    });
}

// const mergeMaps = (source, destination) => {
//     if (source.source[0] >= destination.source[0] && source.source[0] <= destination.source[1]) {
//         return source;
//     }
// };

const findInMap = (x, map) => {
    if (x >= map.source[0] && x <= map.source[1]) {
        // console.log("found", x, map);
        return x - map.source[0] + map.destination[0];
    }
    return -1;
}

const findX = async (seed, arrays) => {
    let x = seed;
    for (const array of arrays) {
        for (const map of array) {
            x = findInMap(x, map) < 0 ? x : findInMap(x, map);
            if (m >= 0) {
                break;
            }
        }
    }
    return x;
}

const main = async () => {
    try {
        // const data = fs.readFileSync('testinput.csv', 'utf8');
        const data = fs.readFileSync('puzzleinput.csv', 'utf8');
        const lines = data.split('\n');
        const seeds = lines[0].split(':')[1].trim().split(/\s+/).map((s) => s.trim());

        const arrays = [];
        let name = '';

        for (let i = 1; i < lines.length; i++) {
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
        // const names = ["soil", "fertilizer", "water", "light", "temperature", "humidity", "location"];
        const promises = [];
        let minLocation = Number.MAX_SAFE_INTEGER;
        for (let index = 0; index < seeds.length; index += 2) {
            for (let j = 0; j < seeds[index + 1]; j++) {
                let x = parseInt(seeds[index]) + j;
                promises.push(findX(x, arrays));
                // for (const array of arrays) {
                //     for (const map of array) {
                //         const m = findInMap(x, map);
                //         x = m < 0 ? x : m;
                //         if (m >= 0) {
                //             break;
                //         }
                //     }
                // }
                // if (x < minLocation) {
                //     minLocation = x;
                // }
            }
        }
        // console.log(promises);
        let results = await Promise.all(promises);
        for (const x of results) {
            if (x < minLocation) {
                minLocation = x;
            }
        }
        console.log(minLocation);
    } catch (err) {
        console.error(err);
    }
}

main();