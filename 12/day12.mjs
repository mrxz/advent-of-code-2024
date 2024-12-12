let input = [
    /* Insert AoC day 12 input here */
    "RRRRIICCFF",
    "RRRRIICCCF",
    "VVRRRCCFFF",
    "VVRCCCJFFF",
    "VVVVCJJCFE",
    "VVIVCCJJEE",
    "VVIIICJJEE",
    "MIIIIIJJEE",
    "MIIISIJEEE",
    "MMMISSJEEE",
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
        setValue(board, x, y, input[y][x]);
    }
}

const marked = {};
function fill(x, y, value, region) {
    if(x < 0 || x >= width || y < 0 || y >= height) {
        return;
    }
    if(getValue(marked, x, y, null) !== null) {
        return;
    }
    if(getValue(board, x, y, null) !== value) {
        return;
    }
    setValue(marked, x, y, value);

    region.push({x, y});

    fill(x - 1, y, value, region);
    fill(x + 1, y, value, region);
    fill(x, y + 1, value, region);
    fill(x, y - 1, value, region);
}

// Find areas
const regions = [];
for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
        if(getValue(marked, x, y, null) !== null) {
            continue;
        }

        // New region
        const value = getValue(board, x, y);
        const region = [];
        fill(x, y, value, region);
        regions.push(region);
    }
}

// Count up perimeters
let sum = 0;
let sum2 = 0;
for(const region of regions) {
    const uEdges = [];
    const dEdges = [];
    const lEdges = [];
    const rEdges = [];

    const area = region.length;
    let perimeter = 0;
    for(let i = 0; i < region.length; i++) {
        const cell = region[i];
        const x = cell.x;
        const y = cell.y;
        perimeter += 4;
        if(region.find(x => x.x === cell.x - 1 && x.y === cell.y)) {
            perimeter--;
        } else {
            lEdges.push({x, y});
        }
        if(region.find(x => x.x === cell.x + 1 && x.y === cell.y)) {
            perimeter--;
        } else {
            rEdges.push({x, y});
        }
        if(region.find(x => x.x === cell.x && x.y === cell.y + 1)) {
            perimeter--;
        } else {
            dEdges.push({x, y});
        }
        if(region.find(x => x.x === cell.x && x.y === cell.y - 1)) {
            perimeter--;
        } else {
            uEdges.push({x, y});
        }
    }
    sum += area * perimeter;

    // Part 2: find sides (runs of edges)
    let sides = 0;
    uEdges.sort((a, b) => a.y - b.y || a.x - b.x);
    let lastY = -1;
    let lastX = -1;
    for(let i = 0; i < uEdges.length; i++) {
        const edge = uEdges[i];
        if(edge.y !== lastY || Math.abs(edge.x - lastX) > 1) {
            sides++;
            lastY = edge.y;
        }
        lastX = edge.x;
    }

    dEdges.sort((a, b) => a.y - b.y || a.x - b.x);
    lastY = -1;
    for(let i = 0; i < dEdges.length; i++) {
        const edge = dEdges[i];
        if(edge.y !== lastY || Math.abs(edge.x - lastX) > 1) {
            sides++;
            lastY = edge.y;
        }
        lastX = edge.x;
    }

    lEdges.sort((a, b) => a.x - b.x || a.y - b.y);
    lastX = -1;
    lastY = -1;
    for(let i = 0; i < lEdges.length; i++) {
        const edge = lEdges[i];
        if(edge.x !== lastX || Math.abs(edge.y - lastY) > 1) {
            sides++;
            lastX = edge.x;
        }
        lastY = edge.y;
    }

    rEdges.sort((a, b) => a.x - b.x || a.y - b.y);
    lastX = -1;
    lastY = -1;
    for(let i = 0; i < rEdges.length; i++) {
        const edge = rEdges[i];
        if(edge.x !== lastX || Math.abs(edge.y - lastY) > 1) {
            sides++;
            lastX = edge.x;
        }
        lastY = edge.y;
    }

    sum2 += area * sides;
}

console.log(sum);
console.log(sum2);