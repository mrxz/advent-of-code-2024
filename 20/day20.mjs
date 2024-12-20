let input = [
    /* Insert AoC day 20 input here */
    "###############",
    "#...#...#.....#",
    "#.#.#.#.#.###.#",
    "#S#...#.#.#...#",
    "#######.#.#.###",
    "#######.#.#...#",
    "#######.#.###.#",
    "###..E#...#...#",
    "###.#######.###",
    "#...###...#...#",
    "#.#####.#.###.#",
    "#.#...#.#.#...#",
    "#.#.#.#.#.#.###",
    "#...#...#...###",
    "###############",
]

let board = {};
const getKey = (x,y) => `${x}x${y}`;
const setValue = (board, x, y, value) => {
    board[getKey(x, y)] = value;
}
const getValue = (board, x, y, fallback = null) => {
    return board[getKey(x, y)] ?? fallback
}

let startX = -1;
let startY = -1;
let endX = -1;
let endY = -1;

// Parse
const height = input.length;
const width = input[0].length;
for(let y = 0; y < input.length; y++) {
    for(let x = 0; x < input[y].length; x++) {
        const v = input[y][x];
        if(v === 'E') {
            endX = x;
            endY = y;
            setValue(board, x, y, '.');
        } else if(v === 'S') {
            startX = x;
            startY = y;
            setValue(board, x, y, '.');
        } else {
            setValue(board, x, y, v);
        }
    }
}

// Keep track of the distances to the end
let distBoard = {...board};
const bfs = (initialState) => {
    let queue = [initialState];
    let seenKey = (state) => `${state.x}|${state.y}`
    let visited = {};
    let i = 0;

    while(queue.length) {
        const nextQueue = [];
        i++;

        for(let state of queue) {
            const stateKey = seenKey(state);
            if(stateKey in visited) {
                continue;
            }
            visited[stateKey] = true

            if(state.x === endX && state.y === endY) {
                // Found the end, trace back
                let curr = state;
                let length = i - 1;
                let distanceToEnd = length;
                while(curr) {
                    setValue(distBoard, curr.x, curr.y, length - distanceToEnd--);
                    curr = curr.prev;
                }
                return i - 1;
            }

            // Check all neighbours
            if(getValue(board, state.x - 1, state.y, '#') !== '#') {
                nextQueue.push({x: state.x - 1, y: state.y, prev: state, cheat1: state.cheat1 });
            }
            if(getValue(board, state.x + 1, state.y, '#') !== '#') {
                nextQueue.push({x: state.x + 1, y: state.y, prev: state, cheat1: state.cheat1 });
            }
            if(getValue(board, state.x, state.y - 1, '#') !== '#') {
                nextQueue.push({x: state.x, y: state.y - 1, prev: state, cheat1: state.cheat1 });
            }
            if(getValue(board, state.x, state.y + 1, '#') !== '#') {
                nextQueue.push({x: state.x, y: state.y + 1, prev: state, cheat1: state.cheat1 });
            }
        }

        queue = nextQueue;
    }
}

// Compute distances
bfs({x: startX, y: startY});

let count1 = 0;
let count2 = 0;
for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
        const v = getValue(distBoard, x, y, 'X')

        // Part 1
        if(v === '#') {
            // Horizontal
            const left = getValue(distBoard, x - 1, y, '#');
            const right = getValue(distBoard, x + 1, y, '#');
            if(left !== '#' && right !== '#') {
                if(Math.abs(left - right) - 2 >= 100) {
                    count1++;
                }
            }

            // Vertical
            const up = getValue(distBoard, x, y - 1, '#');
            const down = getValue(distBoard, x, y + 1, '#');
            if(up !== '#' && down !== '#') {
                if(Math.abs(up - down) - 2 >= 100) {
                    count1++;
                }
            }
        } else if(v !== 'X') {
            // Part 2
            for(let dx = -20; dx <= 20; dx++) {
                for(let dy = -20; dy <= 20; dy++) {
                    const length = Math.abs(dx) + Math.abs(dy)
                    if(length > 20 || length <= 1) {
                        continue;
                    }

                    const destination = getValue(distBoard, x + dx, y + dy, '#');
                    if(destination !== '#') {
                        if(destination - v - length >= 100) {
                            count2++;
                        }
                    }
                }
            }
        }
    }
}

console.log(count1);
console.log(count2);
