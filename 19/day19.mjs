let input = [
    /* Insert AoC day 19 input here */
    "r, wr, b, g, bwu, rb, gb, br",
    "",
    "brwrr",
    "bggr",
    "gbbr",
    "rrbgbr",
    "ubwu",
    "bwurrg",
    "brgr",
    "bbrgwb",
]

const blocks = input[0].split(", ");

let memo = {}
const dfs = (str, target) => {
    if(str in memo) {
        return memo[str];
    }

    if(str === target) {
        return 1;
    }

    let result = 0;
    for(const block of blocks) {
        if(target.startsWith(str + block)) {
            result += dfs(str + block, target);
        }
    }
    memo[str] = result;
    return result;
}

let sum = 0;
let sum2 = 0;
for(let i = 2; i < input.length; i++) {
    memo = {};
    const result = dfs("", input[i]);
    if(result > 0) {
        sum++
        sum2 += result;
    }
}

console.log(sum);  // Part 1
console.log(sum2); // Part 2

