const fs = require('node:fs');

const partNumbers = {};

const isNumber = (c) => {
    return (c >= '0' && c <= '9')
}

const isSymbol = (c) => {
    return !isNumber(c) && c != '.';
}

const fetchNumber = (schematic, i, j) => {
    let numberStart = j;
    let numberEnd = j;
    while (isNumber(schematic[i][numberStart])) {
        numberStart--;
    }
    while (isNumber(schematic[i][numberEnd])) {
        numberEnd++;
    }
    partNumbers[`${i},${numberStart+1}`] = parseInt(schematic[i].slice(numberStart+1, numberEnd).join(''));
}

const searchAround = (schematic, i, j) => {
    if (isNumber(schematic[i-1][j-1])) {
        fetchNumber(schematic, i-1, j-1);
    }
    if (isNumber(schematic[i-1][j])) {
        fetchNumber(schematic, i-1, j);
    }
    if (isNumber(schematic[i-1][j+1])) {
        fetchNumber(schematic, i-1, j+1);
    }
    if (isNumber(schematic[i][j-1])) {
        fetchNumber(schematic, i, j-1);
    }
    if (isNumber(schematic[i][j+1])) {
        fetchNumber(schematic, i, j+1);
    }
    if (isNumber(schematic[i+1][j-1])) {
        fetchNumber(schematic, i+1, j-1);
    }
    if (isNumber(schematic[i+1][j])) {
        fetchNumber(schematic, i+1, j);
    }
    if (isNumber(schematic[i+1][j+1])) {
        fetchNumber(schematic, i+1, j+1);
    }
}

try {
    //const data = fs.readFileSync('testinput.csv', 'utf8');
    const data = fs.readFileSync('puzzleinput.csv', 'utf8');
    const dataArray = data.split('\n');
    const schematic = [];
    let sum = 0;
    for (const l of dataArray) {
        schematic.push(l.split(''));
    }
    for(let i=0; i<schematic.length; i++) {
        for(let j=0; j<schematic[i].length; j++) {
            if(isSymbol(schematic[i][j])) {
                searchAround(schematic, i, j);
            }
        }
    }
    for(const number of Object.values(partNumbers)) {
        sum += number;
    }
    console.log(partNumbers, sum);
} catch (err) {
    console.error(err);
}