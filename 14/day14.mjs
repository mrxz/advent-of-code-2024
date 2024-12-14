let input = [
    /* Insert AoC day 14 input here */
    "p=0,4 v=3,-3",
    "p=6,3 v=-1,-3",
    "p=10,3 v=-1,2",
    "p=2,0 v=2,-1",
    "p=0,0 v=1,3",
    "p=3,0 v=-2,-2",
    "p=7,6 v=-1,-3",
    "p=3,0 v=-1,-2",
    "p=9,3 v=2,3",
    "p=7,3 v=-1,2",
    "p=2,4 v=2,-3",
    "p=9,5 v=-3,-3",
]

// Adjust to width = 11 and height = 7 for test input
const width = 101;
const height = 103;

// Parse input
const robots = [];
for(let line of input) {
    const [posS, velS] = line.split(" ");
    const [x, y] = posS.split("=")[1].split(",").map(x => +x);
    const [vx, vy] = velS.split("=")[1].split(",").map(x => +x);

    robots.push({x, y, vx, vy});
}

let board = {};
const getKey = (x,y) => `${x}x${y}`;
const setValue = (board, x, y, value) => {
    board[getKey(x, y)] = value;
}
const getValue = (board, x, y, fallback = null) => {
    return board[getKey(x, y)] ?? fallback
}
const printBoard = (board, xi, yi, width, height) => {
    for(let y = yi; y < height; y++) {
        let line = ""
        for(let x = xi; x < width; x++) {
            line += getValue(board, x, y, '.');
        }
        console.log(line);
    }
}

function computePeriod() {
    // Determine the period of all robots (assume they have the same)
    for(const robotTemplate of robots) {
        const robot = {...robotTemplate}
        const states = {};
        let seconds = 0;
        while(true) {
            const state = `${robot.x}|${robot.y}`;
            if(state in states) {
                return seconds;
            }
            states[state] = seconds;
            robot.x = (robot.x + robot.vx + width) % width
            robot.y = (robot.y + robot.vy + height) % height

            seconds++;
        }
    }
}

function countQuadrants() {
    // Count quadrants
    let topLeft = 0;
    let topRight = 0;
    let bottomLeft = 0;
    let bottomRight = 0;
    for(const robot of robots) {
        if(robot.y === Math.floor(height/2)) {
            continue;
        }
        if(robot.x === Math.floor(width/2)) {
            continue;
        }
        // Top half
        if(robot.y < height/2) {
            if(robot.x < width/2) {
                topLeft++;
            } else {
                topRight++;
            }
        } else {
            if(robot.x < width/2) {
                bottomLeft++;
            } else {
                bottomRight++;
            }
        }
    }

    return topLeft * topRight * bottomLeft * bottomRight;
}

function detectHorizontalRow() {
    const bins = [];
    for(const robot of robots) {
        bins[robot.y] = (bins[robot.y] ?? []);
        bins[robot.y].push(robot.x);
    }

    // Find a run of 8 robots horizontally
    for(const bin of bins) {
        if(!bin) continue;
        bin.sort((a,b) => a - b);
        let run = 0;
        for(let i = 1; i < bin.length; i++) {
            if(bin[i-1] === bin[i] -1) {
                run++;
                if(run >= 8) {
                    return true;
                }
            } else {
                run = 0;
            }
        }
    }
    return false;
}

// Part 1 & 2
let part1 = -1;
let part2 = -1;
const period = computePeriod();
for(let i = 0; i <= Math.max(period, 99); i++) {
    // Step
    for(const robot of robots) {
        robot.x = (robot.x + robot.vx + width) % width
        robot.y = (robot.y + robot.vy + height) % height
    }

    if(i === 99) {
        part1 = countQuadrants();
    }

    if(detectHorizontalRow()) {
        // Visualize the tree
        part2 = i + 1; // i=0 already takes a step, hence + 1
        board = {};
        for(const robot of robots) {
            setValue(board, robot.x, robot.y, '#');
        }
        printBoard(board, 0, 0, width, height);
    }
}

console.log(part1);
console.log(part2);