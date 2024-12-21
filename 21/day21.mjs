let input = [
    /* Insert AoC day 21 input here */
    "029A",
    "980A",
    "179A",
    "456A",
    "379A"
]

// Keypad layouts
const numeric = [
    "789",
    "456",
    "123",
    "#0A"
]
const dir = [
    "#^A",
    "<v>"
]

// Board utils
const getKey = (x,y) => `${x}x${y}`;
const setValue = (board, x, y, value) => {
    board[getKey(x, y)] = value;
}
const getValue = (board, x, y, fallback = null) => {
    return board[getKey(x, y)] ?? fallback
}

// Compute all paths between all key pairs
const computeBestPaths = (layout) => {
    // Parse layout into a board
    const width = layout[0].length;
    const height = layout.length;
    const board = {};
    for(let y = 0; y < layout.length; y++) {
        for(let x = 0; x < layout[y].length; x++) {
            setValue(board, x, y, layout[y][x]);
        }
    }

    const paths = {};

    // Iterate all keys to start from
    for(let fromY = 0; fromY < height; fromY++) {
        for(let fromX = 0; fromX < width; fromX++) {
            const from = getValue(board, fromX, fromY);
            if(from === '#') continue;

            // Iterate all keys to go to
            for(let toY = 0; toY < height; toY++) {
                for(let toX = 0; toX < width; toX++) {
                    const to = getValue(board, toX, toY);
                    if(to === '#') continue;

                    // Determine the steps in each direction
                    // Note: repeated key presses are optimal, so only consider all horizontal followed
                    //       by all vertical and vice versa
                    const horizontal = toX - fromX;
                    const horizontalStr = (horizontal < 0 ? '<' : '>').repeat(Math.abs(horizontal));
                    const vertical = toY - fromY;
                    const verticalStr = (vertical < 0 ? '^' : 'v').repeat(Math.abs(vertical));

                    let path = '';

                    // Prefer vertical when horizontal movement is to the right
                    if(horizontal > 0) {
                        // Prevent going through invalid square
                        if(getValue(board, fromX, fromY + vertical, '#') === '#') {
                            path = horizontalStr + verticalStr;
                        } else {
                            path = verticalStr + horizontalStr
                        }
                    } else {
                        // Prevent going through invalid square
                        if(getValue(board, fromX + horizontal, fromY, '#') === '#') {
                            path = verticalStr + horizontalStr;
                        } else {
                            path = horizontalStr + verticalStr
                        }
                    }

                    paths[from] = paths[from] ?? {}
                    paths[from][to] = path;
                }
            }
        }
    }

    return paths;
}
const numericPaths = computeBestPaths(numeric);
const dirPaths = computeBestPaths(dir);

// Performs a simple conversion from input sequence of steps
// to steps needed to instruct a robot to do those steps
const convert = (from, lookup) => {
    const result = [];
    let state = 'A'; // Initial state
    for(const key of from) {
        result.push(...lookup[state][key], 'A');
        state = key;
    }

    return result;
}

const INTERMEDIATE_ROBOTS = 25;
let sum1 = 0;
let sum2 = 0;
for(const line of input) {
    const numeric = parseInt(line);

    // Perform the first conversion from target input sequence to robot steps
    const numericKeypadRobot = convert(line, numericPaths);

    // Tally up all movements
    let tally = {};
    for(let i = 0; i < numericKeypadRobot.length; i++) {
        const prev = numericKeypadRobot[i - 1] ?? 'A';
        const curr = numericKeypadRobot[i];
        tally[prev + curr] = (tally[prev + curr] ?? 0) + 1;
    }

    // Perform the additional layers through tallying sequences
    for(let i = 0; i < INTERMEDIATE_ROBOTS; i++) {
        const t = {};
        for(const pair in tally) {
            if(pair[0] === pair[1]) {
                // Only need to press A
                t['AA'] = (t['AA'] ?? 0) + tally[pair];
                continue;
            }

            const from = pair[0];
            const to = pair[1];
            const steps = [...dirPaths[from][to], 'A'];
            //console.log(steps);
            for(let j = 0; j < steps.length; j++) {
                let prev = steps[j - 1] ?? 'A';
                let curr = steps[j];
                t[prev + curr] = (t[prev + curr] ?? 0) + tally[pair];
            }
        }

        // Part 1
        if(i === 2) {
            const length = Object.values(tally).reduce((acc,x) => acc + x);
            sum1 += length * numeric;
        }

        tally = t;
    }

    const length = Object.values(tally).reduce((acc,x) => acc + x);
    sum2 += length * numeric;
}
console.log(sum1);
console.log(sum2);
