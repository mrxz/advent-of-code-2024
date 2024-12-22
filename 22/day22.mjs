let input = [
    /* Insert AoC day 22 input here */
    1n,
    2n,
    3n,
    2024n,
]

function next(n) {
    n ^= n << 6n;
    n %= 16777216n;
    n ^= n >> 5n;
    n %= 16777216n;
    n ^= n << 11n;
    n %= 16777216n;
    return n;
}

// Part 1
let sum = 0n;
// Keep track of values associated with first occurrences of 4 long sequences
const sequenceValues = {};
for(let number of input) {
    let prev = null;
    let curr = number;
    let encountered = {};
    let seq = [];
    for(let i = 0; i < 2000; i++) {
        prev = curr;
        curr = next(curr);

        const delta = curr%10n - prev%10n;
        if(seq.length === 4) {
            seq.shift();
            seq.push(delta);

            // Tally up value associated with this delta sequence,
            // if it's the first time encountering it for this input number.
            const key = seq.join('|');
            if(!encountered[key]) {
                sequenceValues[key] = (sequenceValues[key] ?? 0) + Number(curr%10n)
                encountered[key] = true;
            }
        } else {
            // Grow delta sequence up to length 4
            seq.push(delta);
        }
    }

    sum += curr;
}

console.log(sum);
console.log(Math.max(...Object.values(sequenceValues)));

