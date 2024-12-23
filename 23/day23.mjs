let input = [
    /* Insert AoC day 23 input here */
    "kh-tc",
    "qp-kh",
    "de-cg",
    "ka-co",
    "yn-aq",
    "qp-ub",
    "cg-tb",
    "vc-aq",
    "tb-ka",
    "wh-tc",
    "yn-cg",
    "kh-ub",
    "ta-co",
    "de-co",
    "tc-td",
    "tb-wq",
    "wh-td",
    "ta-ka",
    "td-qp",
    "aq-cg",
    "wq-ub",
    "ub-vc",
    "de-ta",
    "wq-aq",
    "wq-vc",
    "wh-yn",
    "ka-de",
    "kh-ta",
    "co-tc",
    "wh-qp",
    "tb-vc",
    "td-yn",
]

// Parse
let graph = {};
for(const line of input) {
    const [from, to] = line.split("-");
    graph[from] = (graph[from] ?? []);
    graph[from].push(to);
    graph[to] = (graph[to] ?? []);
    graph[to].push(from);
}

// Part 1: Find triplets
const triplets = {};
for(let node of Object.keys(graph)) {
    const neighbours = graph[node];
    for(let i = 0; i < neighbours.length; i++) {
        for(let j = i + 1; j < neighbours.length; j++) {
            if(graph[neighbours[i]].includes(neighbours[j])) {
                const triplet = [node, neighbours[i], neighbours[j]]
                triplet.sort();
                const key = triplet.join('|');
                if(!(key in triplets)) {
                    triplets[key] = triplet;
                }
            }
        }
    }
}

const candidates = Object.values(triplets).filter(t => t.some(node => node.startsWith('t')));
console.log(candidates.length);

// Part 2: Find largest clique
let maxClique = [];
for(let start of Object.keys(graph)) {
    const clique = [start];

    for(let node of Object.keys(graph)) {
        if(clique.every(n => graph[n].includes(node))) {
            clique.push(node);
        }
    }

    if(clique.length > maxClique.length) {
        maxClique = clique;
    }
}

console.log(maxClique.sort().join(','));
