let input = [
    /* Insert AoC day 24 input here */
    "x00: 1",
    "x01: 1",
    "x02: 1",
    "y00: 0",
    "y01: 1",
    "y02: 0",
    "",
    "x00 AND y00 -> z00",
    "x01 XOR y01 -> z01",
    "x02 OR y02 -> z02",
]

// Parse
let i = 0;
let wires = {};
while(input[i] !== '') {
    const [wire, value] = input[i].split(": ");
    wires[wire] = + value
    i++;
}
const originalWires = {...wires};
i++;

const gates = [];
const wireToGate = {};
let id = 0;
for(; i < input.length; i++) {
    const [a,op,b,_,out] = input[i].split(" ");
    gates.push({id: id++, a, op, b, out});
    wireToGate[out] = gates[gates.length - 1];
}

// Simulate
function simulate() {
    let anyChange = false;
    do {
        anyChange = false;
        for(const gate of gates) {
            // Check if gate is possible
            if(!(gate.a in wires && gate.b in wires) || (gate.out in wires)) {
                continue;
            }

            anyChange = true;
            switch(gate.op) {
                case 'AND': wires[gate.out] = (wires[gate.a] === 1 && wires[gate.b] === 1) ? 1 : 0; break;
                case 'OR': wires[gate.out] = (wires[gate.a] === 1 || wires[gate.b] === 1) ? 1 : 0; break;
                case 'XOR': wires[gate.out] = wires[gate.a] !== wires[gate.b] ? 1 : 0; break;
            }
        }
    } while(anyChange);
}

// Part 1
simulate();
const digits = Object.entries(wires).filter(e => e[0].startsWith('z')).sort((a, b) => b[0].localeCompare(a[0]));
const result = parseInt(digits.map(e => e[1]).join(''), 2);

console.log(result);

// Part 2
const testWires = {...originalWires};
const targetDigits = {};

const getExpression = (wire) => {
    const gate = wireToGate[wire];
    if(!gate) {
        return wire;
    }
    return [getExpression(gate.a), gate.op, getExpression(gate.b)];
}

const referenced = (expr, result = []) => {
    if (!Array.isArray(expr)) {
        result.push(+expr.substring(1));
    } else {
        referenced(expr[0], result);
        referenced(expr[2], result);
    }

    return result;
}

function swap(a, b) {
    const tmp = gates[a].out;
    gates[a].out = gates[b].out;
    gates[b].out = tmp;

    wireToGate[gates[a].out] = gates[a];
    wireToGate[gates[b].out] = gates[b];
}

function fuzz() {
    for(let i = 0; i < 45; i++) {
        const numeric = i.toString().padStart(2, '0')
        testWires[`x${numeric}`] = Math.random() > 0.5 ? 1 : 0;
        testWires[`y${numeric}`] = Math.random() > 0.5 ? 1 : 0;
    }

    const digitsX = Object.entries(testWires).filter(e => e[0].startsWith('x')).sort((a,b) => b[0].localeCompare(a[0]));
    const digitsY = Object.entries(testWires).filter(e => e[0].startsWith('y')).sort((a,b) => b[0].localeCompare(a[0]));
    const x = parseInt(digitsX.map(e => e[1]).join(''), 2);
    const y = parseInt(digitsY.map(e => e[1]).join(''), 2);
    const z = x + y;
    const zStr = z.toString(2).padStart(46, '0');
    for(let i = 0; i < 46; i++) {
        const d = +zStr[i];
        const numeric = (45-i).toString().padStart(2, '0')
        targetDigits[`z${numeric}`] = d;
    }
}

const analyze = () => {
    const analysis = [];
    for(let i = 0; i < 46; i++) {
        analysis[i] = 0;
    }
    for(let iter = 0; iter < 100; iter++) {
        fuzz();
        wires = {...testWires}
        simulate();
        for(let i = 0; i < 46; i++) {
            const numeric = i.toString().padStart(2, '0')
            const wire = `z${numeric}`;
            if(wires[wire] !== targetDigits[wire]) {
                analysis[i] = (analysis[i] ?? 0) + 1;
            }
        }
    }
    return analysis;
}

const swapped = [];
let lastAttempt = -1;
outer:
do {
    // Compute the bins
    const bins = {};
    for(const gate of gates) {
        const expr = getExpression(gate.out);
        const refs = referenced(expr);

        const key = [...new Set(refs)].sort((a,b)=>a-b).join('|');
        if(!bins[key]) {
            bins[key] = [];
        }
        bins[key].push(gate);
    }

    const analysis = analyze();
    const failing = analysis.findIndex(x => x !== 0);
    if(failing === lastAttempt) {
        console.error('FAILED');
        break outer;
    }
    lastAttempt = failing;
    console.log(`Trying to find fix for z${failing}`);

    // Check why this one is failing
    const numeric = failing.toString().padStart(2, '0');
    const expr = getExpression(`z${numeric}`);
    const refSet = new Set(referenced(expr));
    if(refSet.size !== Math.min(failing + 1, 45)) {
        // NOTE: Assume this entire output should be swapped with a gate that references all relevant input wires
        //       This happened to be the case in the input for 1
        const bin = bins[[...new Array(failing + 1)].map((x, i) => i).join('|')];
        // Attempt each one
        for(const gate of bin) {
            const gateOut = gate.out;
            swap(gate.id, wireToGate[`z${numeric}`].id);
            const analysis = analyze();
            if(analysis.every((e, i) => i > failing || e === 0)) {
                swapped.push(gate.out, gateOut);
                continue outer;
            }
            swap(gate.id, wireToGate[`z${numeric}`].id);
        }
    } else {
        // Look for a suitable swap to improve the situation
        for(const [binKey, bin] of Object.entries(bins)) {
            for(let a = 0; a < bin.length; a++) {
                for(let b = a + 1; b < bin.length; b++) {
                    swap(bin[a].id, bin[b].id);
                    const analysis = analyze();

                    if(analysis.every((e, i) => i > failing || e === 0)) {
                        swapped.push(bin[a].out, bin[b].out);
                        continue outer;
                    }

                    swap(bin[a].id, bin[b].id);
                }
            }
        }
    }
} while(swapped.length < 8);

console.log(swapped.sort().join(','));