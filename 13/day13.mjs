let input = [
    /* Insert AoC day 13 input here */
    "Button A: X+94, Y+34",
    "Button B: X+22, Y+67",
    "Prize: X=8400, Y=5400",
    "",
    "Button A: X+26, Y+66",
    "Button B: X+67, Y+21",
    "Prize: X=12748, Y=12176",
    "",
    "Button A: X+17, Y+86",
    "Button B: X+84, Y+37",
    "Prize: X=7870, Y=6450",
    "",
    "Button A: X+69, Y+23",
    "Button B: X+27, Y+71",
    "Prize: X=18641, Y=10279",
    "",
]

function computeCost(a, b, price) {
    const rx = (price[0] % b[0]);
    for(let i = 0; i <= b[0]; i++) {
        if((rx - a[0]*i) % b[0] === 0) {
            // Assume maximum amount of B presses, at least i A presses are needed to reach price (on X-axis)
            let ta = i;
            let tb = (price[0] - ta*a[0])/b[0]
            let sum = ta*a[1]+tb*b[1];

            // Determine how many increments of a[0] we're off on the Y-axis
            let target = price[1] - sum;
            let delta = (ta*a[1]+tb*b[1]) - ((ta+b[0])*a[1]+(tb-a[0])*b[1]);
            let steps = Math.floor(target / -delta);

            // Jump ahead
            ta = i + steps*b[0];
            tb = (price[0] - ta*a[0])/b[0];

            // Verify this reaches the price
            const x = ta*a[0] + tb*b[0];
            const y = ta*a[1] + tb*b[1];
            if(x === price[0] && y === price[1]) {
                return ta * 3 + tb;
            }
        }
    }
    return 0;
}

let sum = 0;
let sum2 = 0;
for(let i = 3; i < input.length; i += 4) {
    const a = input[i - 3].split(": ")[1].split(", ").map(t => +t.substring(2));
    const b = input[i - 2].split(": ")[1].split(", ").map(t => +t.substring(2));
    const price = input[i - 1].split(": ")[1].split(", ").map(t => +t.substring(2));

    sum += computeCost(a, b, price);
    sum2 += computeCost(a, b, [price[0] + 10000000000000, price[1] + 10000000000000]);
}

console.log(sum);
console.log(sum2);
