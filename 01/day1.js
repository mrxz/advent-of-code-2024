const input = [
    /* Insert AoC day 1 input here */
    "3   4",
    "4   3",
    "2   5",
    "1   3",
    "3   9",
    "3   3",
]

const pairs = input.map(x => x.split(/\s+/).map(y => +y));
const a = pairs.map(x => x[0]);
const b = pairs.map(x => x[1]);

a.sort();
b.sort();

let sum = 0;
for(let i = 0; i < a.length; i++) {
    sum += Math.abs(a[i] - b[i]);
}

console.log(sum);

const lookup = [];
for(let i = 0; i < b.length; i++) {
    lookup[b[i]] = (lookup[b[i]] || 0) + 1
}

let sum2 = 0;
for(let i = 0; i < a.length; i++) {
    sum2 += a[i] * (lookup[a[i]] || 0);
}
console.log(sum2)
