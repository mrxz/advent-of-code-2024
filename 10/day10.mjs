let input = [
    /* Insert AoC day 10 input here */
    "89010123",
    "78121874",
    "87430965",
    "96549874",
    "45678903",
    "32019012",
    "01329801",
    "10456732",
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
const height = input.length;
const width = input[0].length;
for(let y = 0; y < input.length; y++) {
    for(let x = 0; x < input[y].length; x++) {
        let value = input[y][x];
        setValue(board, x, y, +value ?? 0);
    }
}

const locations = new Set();
const dfs = (x, y, ) => {
    const value = getValue(board, x, y);
    if(value === 9) {
        locations.add(`${x}|${y}`);
        return 1;
    }
    const nextValue = value + 1;

    let result = 0;
    if(getValue(board, x - 1, y) === nextValue) {
        result += dfs(x - 1, y);
    }
    if(getValue(board, x + 1, y) === nextValue) {
        result += dfs(x + 1, y);
    }
    if(getValue(board, x, y - 1) === nextValue) {
        result += dfs(x, y - 1);
    }
    if(getValue(board, x, y + 1) === nextValue) {
        result += dfs(x, y + 1);
    }

    return result;
}

let sum1 = 0;
let sum2 = 0;
for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
        const value = getValue(board, x, y);
        if(value === 0) {
            locations.clear();
            let rating = dfs(x, y);

            sum1 += locations.size;
            sum2 += rating;
        }
    }
}
console.log(sum1);
console.log(sum2);
