let input = [
    /* Insert AoC day 4 input here */
    "MMMSXXMASM",
    "MSAMXMSMSA",
    "AMXSXMAAMM",
    "MSAMASMSMX",
    "XMASAMXAMM",
    "XXAMMXXAMA",
    "SMSMSASXSS",
    "SAXAMASAAA",
    "MAMMMXMMMM",
    "MXMXAXMASX",
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
const height = input.length;
const width = input[0].length;
for(let y = 0; y < input.length; y++) {
    for(let x = 0; x < input[y].length; x++) {
        setValue(board, x, y, input[y][x]);
    }
}

function getColumn(board, height, col) {
    let result = '';
    for(let y = 0; y < height; y++) {
        result += getValue(board, col, y);
    }
    return result;
}

function getDiagonal(board, height, col) {
    let result = '';
    let x = col;
    for(let y = 0; y < height; y++) {
        result += getValue(board, x, y) ?? '';
        x++;
    }
    return result;
}

function getNegDiagonal(board, height, col) {
    let result = '';
    let x = col;
    for(let y = 0; y < height; y++) {
        result += getValue(board, x, y) ?? '';
        x--;
    }
    return result;
}

const regex = /XMAS/g
function count(line) {
    return [...line.matchAll(regex)].length + // Forward
        [...[...line].reverse().join('').matchAll(regex)].length // Backward
}

let sum = 0;
// Rows
for(const line of input) {
    sum += count(line);
}

// Columns
for(let x = 0; x < width; x++) {
    const line = getColumn(board, height, x);
    sum += count(line);
}

// Positive diagonals
for(let x = -width; x < width * 2; x++) {
    const line = getDiagonal(board, height, x);
    sum += count(line);
}

// Negative diagonals
for(let x = -width; x < width * 2; x++) {
    const line = getNegDiagonal(board, height, x);
    sum += count(line);
}

console.log(sum);

// Part 2
let sum2 = 0;
for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
        if(getValue(board, x, y) !== 'A') {
            continue;
        }

        // Check diagonals
        let topLeft = getValue(board, x - 1, y - 1);
        let bottomRight = getValue(board, x + 1, y + 1);
        if(!(topLeft === 'M' && bottomRight === 'S') && !(topLeft === 'S' && bottomRight === 'M')) {
            continue;
        }

        let topRight = getValue(board, x + 1, y - 1);
        let bottomLeft = getValue(board, x - 1, y + 1);
        if(!(topRight === 'M' && bottomLeft === 'S') && !(topRight === 'S' && bottomLeft === 'M')) {
            continue;
        }

        sum2++;
    }
}
console.log(sum2);