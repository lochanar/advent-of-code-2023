const fs = require('node:fs');

const strength = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'].reverse();

const mapHand = (hand) => {
    const output = {};
    for (const card of hand) {
        if (output[card] === undefined) {
            output[card] = 0;
        }
        output[card]++;
    }
    return output;
};

const scoreHand = (hand) => {
    const map = mapHand(hand);
    let score = 0;
    const keys = Object.keys(map);
    if (keys.length === 1) {
        // console.log(hand,'5 of a kind');
        score = 7;
    } else if (keys.length === 2) {
        if (Object.values(map).includes(4)) {
            // console.log(hand,'4 of a kind');
            score = 6;
        } else {
            // console.log(hand,'full house');
            score = 5;
        }
    } else if (keys.length === 3) {
        if (Object.values(map).includes(3)) {
            // console.log(hand,'3 of a kind');
            score = 4;
        } else {
            // console.log(hand,'2 pairs');
            score = 3;
        }
    } else if (keys.length === 4) {
        // console.log(hand,'2 of a kind');
        score = 2;
    } else {
        score = 1;
    }
    score *= Math.pow(10, 12);
    for (let i=0; i<hand.length; i++) {
        const card = hand[i];
        score += (strength.indexOf(card))*(Math.pow(100, hand.length - i - 1));
    }
    // console.log(hand, map, score);
    return score;
};

try {
    // const data = fs.readFileSync('testinput.csv', 'utf8');
    const data = fs.readFileSync('puzzleinput.csv', 'utf8');
    const lines = data.split('\n');
    let scores = [];
    for (const line of lines) {
        const hand = line.split(/\s+/)[0];
        const bid = parseInt(line.split(/\s+/)[1]);
        scores.push({
            hand: hand,
            bid: bid,
            score: scoreHand(hand)
        });
    }
    // console.log(scores);
    scores = scores.sort((a, b) => a.score - b.score);
    let total = 0;
    for (let i=0; i<scores.length; i++) {
        total += scores[i].bid * (i+1);
    }
    console.log(total);
} catch (err) {
    console.error(err);
}