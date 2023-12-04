const fs = require('node:fs');


try {
    // const data = fs.readFileSync('testinput.csv', 'utf8');
    const data = fs.readFileSync('puzzleinput.csv', 'utf8');
    const games = data.split('\n');
    const cardResults = [];
    for (const game of games) {
        let cardResult = 0;
        const [card, numbers] = game.split(':').map((s) => s.trim());
        const [winningNumberStr, gameNumberStr] = numbers.split('|').map((s) => s.trim());
        const winningNumbers = winningNumberStr.split(/\s+/).map((s) => s.trim());
        const gameNumbers = gameNumberStr.split(/\s+/).map((s) => s.trim());

        for (const winningNumber of winningNumbers) {
            if (gameNumbers.includes(winningNumber)) {
                if (cardResult === 0) {
                    cardResult = 1;
                } else {
                    cardResult = cardResult * 2;
                }
            }
        }
        cardResults.push(cardResult);
    }

    console.log(cardResults.reduce((a, b) => a + b, 0))

} catch (err) {
    console.error(err);
}