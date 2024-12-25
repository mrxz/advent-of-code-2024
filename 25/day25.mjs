let input = [
    /* Insert AoC day 25 input here */
    "#####",
    ".####",
    ".####",
    ".####",
    ".#.#.",
    ".#...",
    ".....",
    "",
    "#####",
    "##.##",
    ".#.##",
    "...##",
    "...#.",
    "...#.",
    ".....",
    "",
    ".....",
    "#....",
    "#....",
    "#...#",
    "#.#.#",
    "#.###",
    "#####",
    "",
    ".....",
    ".....",
    "#.#..",
    "###..",
    "###.#",
    "###.#",
    "#####",
    "",
    ".....",
    ".....",
    ".....",
    "#....",
    "#.#..",
    "#.#.#",
    "#####",
]

const locks = []
const keys = [];
let curr = null;
for(const line of input) {
    if(line === '') {
        curr = null;
        continue;
    }

    if(curr === null) {
        curr = new Array(line.length).fill(-1);
        if(line[0] === '.') {
            keys.push(curr);
        } else {
            locks.push(curr);
        }
    }
    for(let i = 0; i < line.length; i++) {
        curr[i] += line[i] === '#' ? 1 : 0;
    }
}

let matching = 0;
for(const key of keys) {
    for(const lock of locks) {
        if(lock.every((lh, i) => lh + key[i] <= 5)) {
            matching++;
        }
    }
}

console.log(matching);