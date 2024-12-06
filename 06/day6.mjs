let input = [
    /* Insert AoC day 6 input here */
    "....#.....",
    ".........#",
    "..........",
    "..#.......",
    ".......#..",
    "..........",
    ".#..^.....",
    "........#.",
    "#.........",
    "......#...",
]

let board = {};
const getKey = (x,y) => `${x}x${y}`;
const setValue = (board, x, y, value) => {
    board[getKey(x, y)] = value;
}
const getValue = (board, x, y, fallback = null) => {
    return board[getKey(x, y)] || fallback
}

// Parse
let startX = 0, startY = 0;
const height = input.length;
const width = input[0].length;
for(let y = 0; y < input.length; y++) {
    for(let x = 0; x < input[y].length; x++) {
        if(input[y][x] === '^') {
            startX = x;
            startY = y;
            setValue(board, x, y, '.');
        } else {
            setValue(board, x, y, input[y][x]);
        }
    }
}

function walk(startX, startY, dir = 0, obX = -1, obY = -1) {
    let posX = startX;
    let posY = startY;
    const loopPos = new Set();
    const visited = new Set();
    const visitedWithDir = new Set();
    while(posX >=0 && posX < width && posY >= 0 && posY < height) {
        // Move
        let nextX = posX;
        let nextY = posY;
        visited.add(`${posX}|${posY}`)
        if(visitedWithDir.has(`${posX}|${posY}|${dir}`)) {
            // Loop
            return 1;
        }
        visitedWithDir.add(`${posX}|${posY}|${dir}`)
        switch(dir) {
            case 0: nextY--; break;
            case 1: nextX++; break;
            case 2: nextY++; break;
            case 3: nextX--; break;
        }

        let value = getValue(board, nextX, nextY);
        if(value === '#'|| (obX === nextX && obY === nextY)) {
            dir = (dir + 1) % 4;
        } else {
            let possibleDir = (dir + 1) % 4;
            // Obstacle inside field
            if(obX === -1 && nextX >= 0 && nextX < width && nextY >= 0 && nextY < height) {
                // Not on start position
                if(!(nextX === startX && nextY === startY)) {
                    // Not on path thus far
                    if(!visited.has(`${nextX}|${nextY}`)) {
                        let res = walk(posX, posY, possibleDir, nextX, nextY);
                        if(res === 1) {
                            loopPos.add(`${nextX}|${nextY}`);
                        }
                    }
                }
            }

            // Normal movement
            posX = nextX;
            posY = nextY;
        }
    }

    return [ visited, loopPos ];
}

const [ visited, loopPos ] = walk(startX, startY);
console.log(visited.size);
console.log(loopPos.size);