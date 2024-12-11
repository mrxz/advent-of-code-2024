/* Insert AoC day 10 input here */
let input = "125 17";

const stones = input.split(" ").map(x => +x);

const memo = {};
function simulate(stone, steps) {
    if(steps === 0) {
        return 1;
    }
    const key = `${stone}|${steps}`;
    if(key in memo) {
        return memo[key];
    }

    let result = -1;
    if(stone === 0) {
        result = simulate(1, steps - 1);
    } else {
        const stoneS = (""+stone);
        const length = stoneS.length;
        if(length % 2 === 0) {
            const left = +stoneS.substring(0, length/2);
            const right = +stoneS.substring(length/2);
            result = simulate(left, steps - 1) + simulate(right, steps - 1);
        } else {
            result = simulate(stone*2024, steps - 1);
        }
    }

    memo[key] = result;
    return result;
}

console.log(stones.map(s => simulate(s, 25)).reduce((acc, x) => acc + x));
console.log(stones.map(s => simulate(s, 75)).reduce((acc, x) => acc + x));
