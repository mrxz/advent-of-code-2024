let input = [
    /* Insert AoC day 16 input here */
    "#################",
    "#...#...#...#..E#",
    "#.#.#.#.#.#.#.#.#",
    "#.#.#.#...#...#.#",
    "#.#.#.#.###.#.#.#",
    "#...#.#.#.....#.#",
    "#.#.#.#.#.#####.#",
    "#.#...#.#.#.....#",
    "#.#.#####.#.###.#",
    "#.#.#.......#...#",
    "#.#.###.#####.###",
    "#.#.#...#.....#.#",
    "#.#.#.#####.###.#",
    "#.#.#.........#.#",
    "#.#.#.#########.#",
    "#S#.............#",
    "#################",
]

let board = {};
const getKey = (x,y) => `${x}x${y}`;
const setValue = (board, x, y, value) => {
    board[getKey(x, y)] = value;
}
const getValue = (board, x, y, fallback = null) => {
    return board[getKey(x, y)] ?? fallback
}

// Parse
let startX, startY, endX, endY;
for(let y = 0; y < input.length; y++) {
    for(let x = 0; x < input[y].length; x++) {
        if(input[y][x] === 'S') {
            startX = x;
            startY = y;
            setValue(board, x, y, '.');
        } else if(input[y][x] === 'E') {
            endX = x;
            endY = y;
            setValue(board, x, y, '.');
        } else {
            setValue(board, x, y, input[y][x]);
        }
    }
}

function up(state, set = new Set()) {
    set.add(`${state.x}|${state.y}`);
    if(state.parents) {
        for(const parentState of state.parents) {
            up(parentState, set);
        }
    } else if(state.prev) {
        up(state.prev, set);
    }
    return set;
}

const bfs = (initialState) => {
    let bestCost = Number.MAX_SAFE_INTEGER;
    let bestTiles = -1;

    let queue = [initialState];
    let seenKey = (state) => `${state.x}|${state.y}|${state.dir}`
    let visited = {};

    while(queue.length) {
        const nextQueue = [];

        for(let state of queue) {
            const stateKey = seenKey(state);
            if(stateKey in visited) {
                if(visited[stateKey].cost < state.cost) {
                    continue;
                } else if(visited[stateKey].cost === state.cost) {
                    // Keep track of all paths leading into this one for the same cost.
                    if(!visited[stateKey].parents) {
                        visited[stateKey].parents = [visited[stateKey].prev];
                    }
                    visited[stateKey].parents.push(state);
                    continue;
                }
            }
            visited[stateKey] = state

            if(state.x === endX && state.y === endY) {
                if(state.cost < bestCost) {
                    bestCost = state.cost;
                    bestTiles = up(state).size;
                }
                continue;
            }

            // Move forward
            let nextX = state.x;
            let nextY = state.y;
            let dir = state.dir;
            if(dir === 0) nextY -= 1;
            if(dir === 1) nextX += 1;
            if(dir === 2) nextY += 1;
            if(dir === 3) nextX -= 1;
            if(getValue(board, nextX, nextY) === '.') {
                nextQueue.push({x: nextX, y: nextY, dir, cost: state.cost + 1, prev: state});
            }

            // Rotate 90-degrees
            let cwDir = (state.dir + 1) % 4;
            nextQueue.push({x: state.x, y: state.y, dir: cwDir, cost: state.cost + 1000, prev: state.prev});
            let ccwDir = (state.dir + 3) % 4;
            nextQueue.push({x: state.x, y: state.y, dir: ccwDir, cost: state.cost + 1000, prev: state.prev});
        }

        queue = nextQueue;
    }

    return { cost: bestCost, tiles: bestTiles };
}

const {cost, tiles} = bfs({x: startX, y: startY, dir: 1, cost: 0});
console.log(cost);  // Part 1
console.log(tiles); // Part 2