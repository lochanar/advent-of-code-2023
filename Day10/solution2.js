const fs = require('node:fs');
const { get } = require('node:http');

const tree = {};

const addNode = (y, x, dir) => {
    if (!tree[`${y},${x}`]) {
        tree[`${y},${x}`] = {};
    }
    switch (dir) {
        case 'N':
            tree[`${y},${x}`].N = `${y-1},${x}`;
            break;
        case 'S':
            tree[`${y},${x}`].S = `${y+1},${x}`;
            break;
        case 'E':
            tree[`${y},${x}`].E = `${y},${x+1}`;
            break;
        case 'W':
            tree[`${y},${x}`].W = `${y},${x-1}`;
            break;
    }
}

const canGo = (maze, y, x, dir) => {
    switch (dir) {
        case 'N':
            return maze[y-1] && (maze[y-1][x] === '|' || maze[y-1][x] === 'F' || maze[y-1][x] === '7');
        case 'S':
            return maze[y+1] && (maze[y+1][x] === '|' || maze[y+1][x] === 'J' || maze[y+1][x] === 'L');
        case 'E':
            return maze[y][x+1] === '-' || maze[y][x+1] === 'J' || maze[y][x+1] === '7';
        case 'W':
            return maze[y][x-1] === '-' || maze[y][x-1] === 'L' || maze[y][x-1] === 'F';
    
    }
}

const canMove = (maze, y, x) => {
    const value = maze[y][x];
    const moves = [];
    if (value === 'S') {
        if (canGo(maze, y, x, 'N')) {
            addNode(y, x, 'N');
            moves.push([y-1, x]);
        }
        if (canGo(maze, y, x, 'E')) {
            addNode(y, x, 'E');
            moves.push([y, x+1]);
        }
        if (canGo(maze, y, x, 'S')) {
            addNode(y, x, 'S');
            moves.push([y+1, x]);
        }
        if (canGo(maze, y, x, 'W')) {
            addNode(y, x, 'W');
            moves.push([y, x-1]);
        }
    } else if (value === '|') {
        if (canGo(maze, y, x, 'N')) {
            addNode(y, x, 'N');
            moves.push([y-1, x]);
        }
        if (canGo(maze, y, x, 'S')) {
            addNode(y, x, 'S');
            moves.push([y+1, x]);
        }
    } else if (value === '-') {
        if (canGo(maze, y, x, 'E')) {
            addNode(y, x, 'E');
            moves.push([y, x+1]);
        }
        if (canGo(maze, y, x, 'W')) {
            addNode(y, x, 'W');
            moves.push([y, x-1]);
        }
    } else if (value === '7') {
        if (canGo(maze, y, x, 'S')) {
            addNode(y, x, 'S');
            moves.push([y+1, x]);
        }
        if (canGo(maze, y, x, 'W')) {
            addNode(y, x, 'W');
            moves.push([y, x-1]);
        }
    } else if (value === 'J') {
        if (canGo(maze, y, x, 'N')) {
            addNode(y, x, 'N');
            moves.push([y-1, x]);
        }
        if (canGo(maze, y, x, 'W')) {
            addNode(y, x, 'W');
            moves.push([y, x-1]);
        }
    } else if (value === 'L') {
        if (canGo(maze, y, x, 'N')) {
            addNode(y, x, 'N');
            moves.push([y-1, x]);
        }
        if (canGo(maze, y, x, 'E')) {
            addNode(y, x, 'E');
            moves.push([y, x+1]);
        }
    } else if (value === 'F') {
        if (canGo(maze, y, x, 'E')) {
            addNode(y, x, 'E');
            moves.push([y, x+1]);
        }
        if (canGo(maze, y, x, 'S')) {
            addNode(y, x, 'S');
            moves.push([y+1, x]);
        }
    }
    return moves;
};

const canGoFromOutside = (maze, y, x, dir) => {
    // return maze[y] && maze[y][x] === '.';
    switch (dir) {
        case 'N':
        case 'S':
            return (maze[y-1] && (maze[y-1][x] === '.' /*|| maze[y-1][x] === '|' || maze[y-1][x] === 'F' || maze[y-1][x] === '7'*/))
             || (maze[y+1] && (maze[y+1][x] === '.'/* || maze[y+1][x] === '|' || maze[y+1][x] === 'J' || maze[y+1][x] === 'L'*/));
        case 'E':
        case 'W':
            return maze[y] && (maze[y][x+1] === '.' /*|| maze[y][x+1] === '-' || maze[y][x+1] === 'J' || maze[y][x+1] === '7'*/
             || maze[y][x-1] === '.' /*|| maze[y][x-1] === '-' || maze[y][x-1] === 'L' || maze[y][x-1] === 'F'*/);
    
    }
}

const canMoveFromOutside = (maze, y, x) => {
    const moves = [];
    if (canGoFromOutside(maze, y, x, 'N')) {
        moves.push([y-1, x]);
    }
    if (canGoFromOutside(maze, y, x, 'E')) {
        moves.push([y, x+1]);
    }
    if (canGoFromOutside(maze, y, x, 'S')) {
        moves.push([y+1, x]);
    }
    if (canGoFromOutside(maze, y, x, 'W')) {
        moves.push([y, x-1]);
    }
    return moves;
}

const exploreOutside = (maze, y, x, char) => {
    maze[y][x] = char;
    const visited = {};
    const queue = [[y, x]];
    
    while (queue.length > 0) {
        const [y, x] = queue.shift();
        const key = `${y},${x}`;
        if (visited[key]) {
            continue;
        }
        visited[key] = true;
        const moves = canMoveFromOutside(maze, y, x);
        for (let move of moves) {
            const [y, x] = move;
            const key = `${y},${x}`;
            if (!visited[key]) {
                queue.push(move);
            }
        }
        if (maze[y]) {
            maze[y][x] = char;
        }
    }
}

const dfs = (key, depth) => {
    const stack = [];
    stack.push({key, depth});
    while (stack.length > 0) {
        const {key, depth} = stack.pop();
        const node = tree[key];
        if (node.depth === undefined || node.depth > depth) {
            node.depth = depth;
            const [N, E, S, W] = [node.N, node.E, node.S, node.W];
            if (N) {
                stack.push({key: N, depth: depth + 1});
            }
            if (E) {
                stack.push({key: E, depth: depth + 1});
            }
            if (S) {
                stack.push({key: S, depth: depth + 1});
            }
            if (W) {
                stack.push({key: W, depth: depth + 1});
            }
        }
    }
};

const getBelow = (maze, y, x) => {
    if (maze[y+1]) {
        return maze[y+1][x];
    }
    return undefined;
}

const getAbove = (maze, y, x) => {
    if (maze[y-1]) {
        return maze[y-1][x];
    }
    return undefined;
}

const getTopRight = (maze, y, x) => {
    if (maze[y-1]) {
        return maze[y-1][x+1];
    }
    return undefined;
}

const getTopLeft = (maze, y, x) => {
    if (maze[y-1]) {
        return maze[y-1][x-1];
    }
    return undefined;
}

const getLeft = (maze, y, x) => {
    if (maze[y][x-1]) {
        return maze[y][x-1];
    }
    return undefined;
}

const getRight = (maze, y, x) => {
    if (maze[y][x+1]) {
        return maze[y][x+1];
    }
    return undefined;
}

const getBottomLeft = (maze, y, x) => {
    if (maze[y+1]) {
        return maze[y+1][x-1];
    }
    return undefined;
}

const getBottomRight = (maze, y, x) => {
    if (maze[y+1]) {
        return maze[y+1][x+1];
    }
    return undefined;
}

const isLeftEmpty = (maze, y, x, dir) => {
    const output = [];
    switch (dir) {
        case 'N':
            if (getLeft(maze, y, x) === '.') {
                output.push([y,x-1]);
            }
            if (getBelow(maze, y, x) === '.') {
                output.push([y+1,x]);
            }
            if (getBottomLeft(maze, y, x) === '.') {
                output.push([y+1,x-1]);
            }
            return output.length > 0 && output;
        case 'S':
            if (getRight(maze, y, x) === '.') {
                output.push([y,x+1]);
            }
            if (getAbove(maze, y, x) === '.') {
                output.push([y-1,x]);
            }
            if (getTopRight(maze, y, x) === '.') {
                output.push([y-1,x+1]);
            }
            return output.length > 0 && output;
        case 'E':
            if (getLeft(maze, y, x) === '.') {
                output.push([y,x-1]);
            }
            if (getAbove(maze, y, x) === '.') {
                output.push([y-1,x]);
            }
            if (getTopLeft(maze, y, x) === '.') {
                output.push([y-1,x-1]);
            }
            return output.length > 0 && output;
        case 'W':
            if (getRight(maze, y, x) === '.') {
                output.push([y,x+1]);
            }
            if (getBelow(maze, y, x) === '.') {
                output.push([y+1,x]);
            }
            if (getBottomRight(maze, y, x) === '.') {
                output.push([y+1,x+1]);
            }
            return output.length > 0 && output;
    }
    return false;
}

const isRightEmpty = (maze, y, x, dir) => {
    const output = [];
    switch (dir) {
        case 'N':
            if (getBelow(maze, y, x) === '.') {
                output.push([y+1,x]);
            }
            if (getRight(maze, y, x) === '.') {
                output.push([y,x+1]);
            }
            if (getBottomRight(maze, y, x) === '.') {
                output.push([y+1,x+1]);
            }
            return output.length > 0 && output;
        case 'S':
            if (getLeft(maze, y, x) === '.') {
                output.push([y,x-1]);
            }
            if(getAbove(maze, y, x) === '.') {
                output.push([y-1,x]);
            }
            if (getTopLeft(maze, y, x) === '.') {
                output.push([y-1,x-1]);
            }
            return output.length > 0 && output;
        case 'E':
            if (getLeft(maze, y, x) === '.') {
                output.push([y,x-1]);
            }
            if (getBelow(maze, y, x) === '.') {
                output.push([y+1,x]);
            }
            if (getBottomLeft(maze, y, x) === '.') {
                output.push([y+1,x-1]);
            }
            return output.length > 0 && output;
        case 'W':
            if (getRight(maze, y, x) === '.') {
                output.push([y,x+1]);
            }
            if (getAbove(maze, y, x) === '.') {
                output.push([y-1,x]);
            }
            if (getTopRight(maze, y, x) === '.') {
                output.push([y-1,x+1]);
            }
            return output.length > 0 && output;
    }
    return false;
}

try {
    // const data = fs.readFileSync('testinput.csv', 'utf8');
    // const data = fs.readFileSync('testinput2.csv', 'utf8');
    // const data = fs.readFileSync('testinput3.csv', 'utf8');
    const data = fs.readFileSync('puzzleinput.csv', 'utf8');
    const lines = data.split('\n');
    const maze = [];
    const graph = {};
    let startX = 0;
    let startY = 0;
    let y = 0;
    for (let line of lines) {
        let x = 0;
        const row = line.split('').map((s) => s.trim());
        for (let step of row) {
            if (step === 'S') {
                startY = y;
                startX = x;
            }
            x++;
        }
        y++;
        maze.push(row);
    }
    // console.log(startX, startY, maze, maze[startY][startX]);
    const queue = [[startY, startX]];
    const visited = {};
    while (queue.length > 0) {
        const [y, x] = queue.shift();
        const key = `${y},${x}`;
        if (visited[key]) {
            continue;
        }
        visited[key] = true;
        const moves = canMove(maze, y, x);
        for (let move of moves) {
            const [y, x] = move;
            const key = `${y},${x}`;
            if (!visited[key]) {
                queue.push(move);
            }
        }
    }

    // console.log(tree);

    const maxY = maze.length;
    const maxX = maze[0].length;
    for (let y=0; y<maxY; y++) {
        for (let x=0; x<maxX; x++) {
            if (!tree[`${y},${x}`])
                maze[y][x] = '.';
            // else
            //     maze[y][x] = 'x';
        }
    }

    const q2 = [[startY, startX]];
    const v2 = {};
    const right = [];
    const left = [];
    while (q2.length > 0) {
        const [y, x] = q2.shift();
        const key = `${y},${x}`;
        if (v2[key]) {
            continue;
        }
        v2[key] = true;
        const dirs = tree[key];
        for (let k in dirs) {
            const dir = k;
            const key = dirs[k];
            if (!v2[key]) {
                const [y, x] = key.split(',').map((s) => parseInt(s));
                const leftEmpty = isLeftEmpty(maze, y, x, dir);
                if (leftEmpty) {
                    left.push(...leftEmpty);
                }
                const rightEmpty = isRightEmpty(maze, y, x, dir);
                if (rightEmpty) {
                    right.push(...rightEmpty);
                }
                q2.push([y, x]);
            }
            if (x === startX && y === startY) {
                break;
            }
        }
    }

    // exploreOutside(maze, 0, 0);
    // for(let row of maze) {
    //     console.log(row.join(''));
    // }
    // console.log(count);
    // console.log(right, left);
    for (let i=0; i<right.length; i++) {
        const [y, x] = right[i];
        exploreOutside(maze, y, x, 'I');
    }

    for (let i=0; i<left.length; i++) {
        const [y, x] = left[i];
        exploreOutside(maze, y, x, 'O');
    }

    for(let row of maze) {
        console.log(row.join(''));
    }

    let count = 0;
    for(let y=0; y<maze.length; y++) {
        for(let x=0; x<maze[y].length; x++) {
            if (maze[y][x] === 'I') {
                count++;
            }
        }
    }
    console.log(count);
} catch (err) {
    console.error(err);
}