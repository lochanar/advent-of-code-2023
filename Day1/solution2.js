const fs = require('node:fs');

const numberNames = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9
};

const isNumber = (c) => {
    return (c >= '0' && c <= '9')
}

const getNumber = (c) => {
    return numberNames[c];
}

try {
    //const data = fs.readFileSync('testinput.csv', 'utf8');
    const data = fs.readFileSync('puzzleinput.csv', 'utf8');
    const dataArray = data.split('\n');
    let numbers = 0;
    let lines = 0;
    for (const l of dataArray) {
        let line = l;
        let firstNumberIdx = -1;
        let firstNumber = 0;
        let lastNumberIdx = -1;
        let lastNumber = 0;
        for (var i = 0; i <= line.length; i++) {
            if (firstNumberIdx < 0) {
                if (isNumber(line.charAt(i))) {
                    firstNumber = parseInt(line.charAt(i));
                    firstNumberIdx = i;
                }
                for (let name of Object.keys(numberNames)) {
                    if (line.startsWith(name, i)) {
                        firstNumber = getNumber(name);
                        firstNumberIdx = i;
                        break;
                    }
                }
            }
            if (lastNumberIdx < 0) {
                if (isNumber(line.charAt(line.length - i))) {
                    lastNumber = parseInt(line.charAt(line.length - i));
                    lastNumberIdx = i;
                }
                for (let name of Object.keys(numberNames)) {
                    if (line.startsWith(name, line.length - i)) {
                        lastNumber = getNumber(name);
                        lastNumberIdx = i;
                        break;
                    }
                }
            }
            if (firstNumberIdx >= 0 && lastNumberIdx >= 0) {
                numbers += (firstNumber * 10 + lastNumber);
                lines++;
                break;
            }
        }
    }
    console.log(numbers);
} catch (err) {
    console.error(err);
}