const fs = require('node:fs');

const isNumber = (c) => {
    return (c >= '0' && c <= '9')
}

const isStar = (c) => {
    return c == '*';
}

const fetchNumber = (schematic, i, j, partNumbers) => {
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
    const partNumbers = {};
    if (isNumber(schematic[i-1][j-1])) {
        fetchNumber(schematic, i-1, j-1, partNumbers);
    }
    if (isNumber(schematic[i-1][j])) {
        fetchNumber(schematic, i-1, j, partNumbers);
    }
    if (isNumber(schematic[i-1][j+1])) {
        fetchNumber(schematic, i-1, j+1, partNumbers);
    }
    if (isNumber(schematic[i][j-1])) {
        fetchNumber(schematic, i, j-1, partNumbers);
    }
    if (isNumber(schematic[i][j+1])) {
        fetchNumber(schematic, i, j+1, partNumbers);
    }
    if (isNumber(schematic[i+1][j-1])) {
        fetchNumber(schematic, i+1, j-1, partNumbers);
    }
    if (isNumber(schematic[i+1][j])) {
        fetchNumber(schematic, i+1, j, partNumbers);
    }
    if (isNumber(schematic[i+1][j+1])) {
        fetchNumber(schematic, i+1, j+1, partNumbers);
    }
    if (Object.keys(partNumbers).length == 2) {
        //  This is  a gear!
        return Object.values(partNumbers)[0] * Object.values(partNumbers)[1];
    }
    return 0;
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
            if(isStar(schematic[i][j])) {
                sum += searchAround(schematic, i, j);
            }
        }
    }
    console.log(sum);
} catch (err) {
    console.error(err);
}