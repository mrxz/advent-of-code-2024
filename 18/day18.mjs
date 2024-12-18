let input = [
    /* Insert AoC day 18 input here */
    "5,4",
    "4,2",
    "4,5",
    "3,0",
    "2,1",
    "6,3",
    "2,4",
    "1,5",
    "0,6",
    "3,3",
    "2,6",
    "5,1",
    "1,2",
    "5,5",
    "2,5",
    "6,5",
    "1,4",
    "0,4",
    "6,4",
    "1,1",
    "6,1",
    "1,0",
    "0,5",
    "1,6",
    "2,0",
]

let board = {};
const getKey = (x,y) => `${x}x${y}`;
const setValue = (board, x, y, value) => {
    board[getKey(x, y)] = value;
}
const getValue = (board, x, y, fallback = null) => {
    return board[getKey(x, y)] ?? fallback
}

// Parse (adjust values for real input)
let width = 7;      // 71
let height = 7;     // 71
let slice = 12;     // 1024
let endX = width - 1;
let endY = height - 1;

// Create empty board
for(let y = 0; y < width; y++) {
    for(let x = 0; x < height; x++) {
        setValue(board, x, y, Number.MAX_SAFE_INTEGER);
    }
}
input.forEach((line, i) => {
    const [x,y] = line.split(",").map(p => +p)
    setValue(board, x, y, i);
});

let BFS_THRESHOLD = 0;
const bfs = (initialState) => {
    initialState.length = 0;
    let queue = [initialState];
    let seenKey = (state) => `${state.x}|${state.y}`
    let visited = {};

    while(queue.length) {
        const nextQueue = [];

        for(let state of queue) {
            const stateKey = seenKey(state);
            if(stateKey in visited) {
                continue;
            }
            visited[stateKey] = true

            if(state.x === endX && state.y === endY) {
                return state;
            }

            // Check all neighbours
            if(getValue(board, state.x - 1, state.y, -1) > BFS_THRESHOLD) {
                nextQueue.push({x: state.x - 1, y: state.y, prev: state, length: state.length + 1 });
            }
            if(getValue(board, state.x + 1, state.y, -1) > BFS_THRESHOLD) {
                nextQueue.push({x: state.x + 1, y: state.y, prev: state, length: state.length + 1 });
            }
            if(getValue(board, state.x, state.y - 1, -1) > BFS_THRESHOLD) {
                nextQueue.push({x: state.x, y: state.y - 1, prev: state, length: state.length + 1 });
            }
            if(getValue(board, state.x, state.y + 1, -1) > BFS_THRESHOLD) {
                nextQueue.push({x: state.x, y: state.y + 1, prev: state, length: state.length + 1 });
            }
        }

        queue = nextQueue;
    }
}

// Part 1
BFS_THRESHOLD = slice;
console.log(bfs({x: 0, y: 0}).length);

// Part 2
let low = slice;
let high = input.length;
while(low !== high) {
    let mid = ~~((low + high)/2);
    BFS_THRESHOLD = mid;

    const final = bfs({x: 0, y: 0});
    if(!final) {
        high = mid;
    } else {
        low = mid + 1;
    }
}
console.log(input[low]);
