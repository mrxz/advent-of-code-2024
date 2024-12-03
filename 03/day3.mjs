import fs from 'node:fs';

const input = fs.readFileSync('input.txt', 'utf8');

let regex = /^mul\((\d+),(\d+)\)/
let doRE = /^do\(\)/
let dontRE = /^don't\(\)/;
let sum = 0;
let sumPart2 = 0;
let active = true;
for(let i = 0; i < input.length; i++) {
    const subInput = input.substring(i);

    const match = subInput.match(regex);
    if(match) {
        const mul = +match.at(1) * +match.at(2);
        sum += mul;
        sumPart2 += active ? mul : 0;
    } else if(subInput.match(dontRE)) {
        active = false;
    } else if(subInput.match(doRE)) {
        active = true;
    }
}

console.log(sum);
console.log(sumPart2);
