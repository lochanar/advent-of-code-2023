const fs = require('node:fs');

try {
    const data = fs.readFileSync('testinput.csv', 'utf8');
    // const data = fs.readFileSync('puzzleinput.csv', 'utf8');
    const games = data.split('\n');
    const cardCopies = Array(games.length).fill(1);

    let index = 0;
    for (const game of games) {
        let winnings = 0;
        const [card, numbers] = game.split(':').map((s) => s.trim());
        const [winningNumberStr, gameNumberStr] = numbers.split('|').map((s) => s.trim());
        const winningNumbers = winningNumberStr.split(/\s+/).map((s) => s.trim());
        const gameNumbers = gameNumberStr.split(/\s+/).map((s) => s.trim());

        let offset = 0;
        for (const winningNumber of winningNumbers) {
            if (gameNumbers.includes(winningNumber)) {
                winnings++;
                offset++;
                cardCopies[index + offset] += cardCopies[index];
            }
        }
        index++;
    }
    console.log(cardCopies.reduce((a, b) => a + b, 0));
} catch (err) {
    console.error(err);
}