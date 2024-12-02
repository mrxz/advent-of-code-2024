let input = [
    /* Insert AoC day 2 input here */
    "7 6 4 2 1",
    "1 2 7 8 9",
    "9 7 6 2 1",
    "1 3 2 4 5",
    "8 6 4 4 1",
    "1 3 6 7 9",
]

function isSafe(array, asc, des) {
    if (array.length <= 1) {
        return true;
    }

    let diff = array[1] - array[0];
    if (Math.abs(diff) <= 0 || Math.abs(diff) > 3) {
        return false;
    }

    if (diff > 0) {
        des = false;
    }
    if (diff < 0) {
        asc = false;
    }

    return (asc || des) && isSafe(array.slice(1), asc, des)
}

let safe = 0;
let safeWithSkips = 0;
for (let i = 0; i < input.length; i++) {
    let parts = input[i].split(' ').map(x => +x);
    if (isSafe(parts, true, true, true, parts.length)) {
        safe++;
        safeWithSkips++;
    } else {
        for (let j = 0; j < parts.length; j++) {
            const newParts = [...parts];
            newParts.splice(j, 1);
            if (isSafe(newParts, true, true)) {
                safeWithSkips++;
                break;
            }
        }
    }
}

console.log(safe);
console.log(safeWithSkips);
