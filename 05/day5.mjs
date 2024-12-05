let input = [
    /* Insert AoC day 5 input here */
    "47|53",
    "97|13",
    "97|61",
    "97|47",
    "75|29",
    "61|13",
    "75|53",
    "29|13",
    "97|29",
    "53|29",
    "61|53",
    "97|53",
    "61|29",
    "47|13",
    "75|47",
    "97|75",
    "47|61",
    "75|61",
    "47|29",
    "75|13",
    "53|13",
    "",
    "75,47,61,53,29",
    "97,61,53,29,13",
    "75,29,13",
    "75,97,47,61,53",
    "61,13,29",
    "97,13,75,29,47",
]

let constraints = {};
let i = 0;
for(const line of input) {
    i++;
    if(line === "") {
        break;
    }

    const parts = line.split("|");
    if(!constraints[parts[1]]) {
        constraints[parts[1]] = [];
    }

    constraints[parts[1]].push(parts[0]);
}

// Topological sort
export function solveOrder(graph) {
    const done = new Set();
    const result = [];

    function visit(key) {
        if(done.has(key)) {
            return;
        }

        for(let i = 0; i < graph[key].after.length; i++) {
            const after = graph[key].after[i];
            visit(after);
        }

        done.add(key);
        result.unshift(key);
    }

    for(const key in graph) {
        if(graph[key].done) {
            continue;
        }
        visit(key);
    }
    return result;
}

let sum = 0;
let sum2 = 0;
for(; i < input.length; i++) {
    const line = input[i];
    const parts = line.split(",");

    const contains = new Set(parts);
    const encountered = new Set();
    let valid = true;
    outer:
    for(const part of parts) {
        encountered.add(part);
        for(const dep of constraints[part] ?? []) {
            if(!contains.has(dep)) {
                continue;
            }
            if(!encountered.has(dep)) {
                valid = false;
                break outer;
            }
        }
    }

    if(valid) {
        // Part 1
        const middle = parts[~~(parts.length / 2)];
        sum += +middle;
    } else {
        // Part2
        const nodes = Object.fromEntries([...contains].map(x => [x, {before: [], after: []}]));
        for(const part of parts) {
            for(const before of constraints[part] ?? []) {
                if(!contains.has(before)) {
                    continue;
                }
                nodes[part].before.push(before);
                nodes[before].after.push(part);
            }
        }

        const order = solveOrder(nodes)
        const middle = order[~~(order.length / 2)];
        sum2 += +middle;
    }
}

console.log(sum);
console.log(sum2);