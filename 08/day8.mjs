let input = [
    /* Insert AoC day 8 input here */
    "............",
    "........0...",
    ".....0......",
    ".......0....",
    "....0.......",
    "......A.....",
    "............",
    "............",
    "........A...",
    ".........A..",
    "............",
    "............",
]

const antenna = {}

// Parse
const height = input.length;
const width = input[0].length;
for(let y = 0; y < input.length; y++) {
    for(let x = 0; x < input[y].length; x++) {
        const n = input[y][x];
        if(n !== '.') {
            if(!antenna[n]) {
                antenna[n] = [];
            }
            antenna[n].push({x, y});
        }
    }
}

// Part 1
const antinodes = new Set();
for(const n in antenna) {
    const batch = antenna[n];

    // Check all pairs
    for(let i = 0; i < batch.length; i++) {
        for(let j = i + 1; j < batch.length; j++) {
            // Compute locations
            const dx = batch[i].x - batch[j].x;
            const dy = batch[i].y - batch[j].y;

            // Backward
            let aX = batch[i].x - 2*dx;
            let aY = batch[i].y - 2*dy;
            if(aX >= 0 && aX < width && aY >= 0 && aY < height) {
                antinodes.add(`${aX}|${aY}`)
            }

            // Forward
            aX = batch[i].x + dx;
            aY = batch[i].y + dy;
            if(aX >= 0 && aX < width && aY >= 0 && aY < height) {
                antinodes.add(`${aX}|${aY}`)
            }
        }
    }
}

console.log(antinodes.size);

// Part 2
antinodes.clear();
for(const n in antenna) {
    const batch = antenna[n];

    // Check all pairs
    for(let i = 0; i < batch.length; i++) {
        for(let j = i + 1; j < batch.length; j++) {
            // Compute locations
            const dx = batch[i].x - batch[j].x;
            const dy = batch[i].y - batch[j].y;

            // The delta is at least one in a direction
            // To avoid having to deal with negative/positive, check Math.max(width, height)*2,
            // starting from -span to span
            let maxSpan = Math.max(width, height);
            let aX = batch[i].x - maxSpan*dx;
            let aY = batch[i].y - maxSpan*dy;
            let t = 0;
            do {
                if(aX >= 0 && aX < width && aY >= 0 && aY < height) {
                    antinodes.add(`${aX}|${aY}`)
                }

                aX += dx;
                aY += dy;
                t++;
            } while(t < maxSpan*2);
        }
    }
}

console.log(antinodes.size);