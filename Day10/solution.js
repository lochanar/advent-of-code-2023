const fs = require('node:fs');

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
            return maze[y-1][x] === '|' || maze[y-1][x] === 'F' || maze[y-1][x] === '7';
        case 'S':
            return maze[y+1][x] === '|' || maze[y+1][x] === 'J' || maze[y+1][x] === 'L';
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
    // console.log(node.depth === undefined || node.depth > depth, node.depth, depth, key);
    // if (node.depth === undefined || node.depth > depth + 1) {
    //     node.depth = depth++;
    //     const [N, E, S, W] = [node.N, node.E, node.S, node.W];
    //     if (N) {
    //         dfs(N, depth);
    //     }
    //     if (E) {
    //         dfs(E, depth);
    //     }
    //     if (S) {
    //         dfs(S, depth);
    //     }
    //     if (W) {
    //         dfs(W, depth);
    //     }
    // }
};

try {
    // const data = fs.readFileSync('testinput.csv', 'utf8');
    // const data = fs.readFileSync('testinput2.csv', 'utf8');
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
    const depth = dfs(`${startY},${startX}`, 0);
    console.log(tree);
    console.log(Object.values(tree).map((n) => n.depth).sort((a, b) => b - a)[0]);
} catch (err) {
    console.error(err);
}