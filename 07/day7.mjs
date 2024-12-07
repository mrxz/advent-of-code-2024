let input = [
    /* Insert AoC day 7 input here */
    "190: 10 19",
    "3267: 81 40 27",
    "83: 17 5",
    "156: 15 6",
    "7290: 6 8 6 15",
    "161011: 16 10 13",
    "192: 17 8 14",
    "21037: 9 7 18 13",
    "292: 11 6 16 20",
]

function possible(total, acc, elements, allowConcat = false) {
    if(elements.length === 0) {
        return total === acc;
    }

    if(acc > total) {
        return false;
    }

    const head = elements[0];
    return possible(total, acc + head, elements.slice(1), allowConcat)
        || possible(total, acc * head, elements.slice(1), allowConcat)
        || (allowConcat && possible(total, +(""+acc+""+head), elements.slice(1), allowConcat));
}

let sum = 0;
let sum2 = 0;
for(const line of input) {
    let [total, elements] = line.split(": ");
    total = +total;
    elements = elements.split(" ").map(x => +x);

    if(possible(total, 0, elements)) {
        sum += total;
        sum2 += total;
    } else if(possible(total, 0, elements, true)) {
        sum2 += total;
    }
}

console.log(sum);
console.log(sum2);