let input = [
    /* Insert AoC day 17 input here */
    "Register A: 2024",
    "Register B: 0",
    "Register C: 0",
    "",
    "Program: 0,3,5,4,3,0",
]

let state = {a: -1, b: -1, c: -1, program: [], pc: 0n}

state.a = BigInt(input[0].split(": ")[1]);
state.b = BigInt(input[1].split(": ")[1]);
state.c = BigInt(input[2].split(": ")[1]);
state.program = input[4].split(": ")[1].split(",").map(x => +x)

function run(state) {
    function toComboOp(op) {
        if(op <= 3n) return op;
        if(op === 4n) return state.a;
        if(op === 5n) return state.b;
        if(op === 6n) return state.c;
        throw new Error('Invalid combo operand: ' + op);
    }

    const out = [];
    while(state.pc < state.program.length) {
        const ins = state.program[state.pc];
        const op1 = BigInt(state.program[state.pc + 1n]);
        switch(ins) {
            case 0: // adv
                state.a = state.a >> toComboOp(op1);
                break;
            case 1: // bxl
                state.b = state.b ^ op1;
                break;
            case 2: // bst
                state.b = toComboOp(op1) % 8n;
                break;
            case 3: // jnz
                if(state.a !== 0n) {
                    state.pc = op1;
                    continue;
                }
                break;
            case 4: // bxc
                state.b = state.b ^ state.c;
                break;
            case 5: // out
                out.push(toComboOp(op1) % 8n)
                break;
            case 6: // bdv
                state.b = state.a >> toComboOp(op1);
                break;
            case 7: // cdv
                state.c = state.a >> toComboOp(op1);
                break;
            default:
                throw new Error('Not implemented');
        }
        state.pc += 2n;
    }
    return out;
}

function dfs(octals) {
    const a = BigInt('0o' + octals.join(''));
    if(octals.length > state.program.length + 1) {
        return;
    }
    // Check output for given octal
    const out = run({...state, a: a});
    if(out.length > state.program.length) {
        return;
    }

    // Check which output digits (already) match and if it's worth continuing
    let allMatch = true;
    for(let i = 0; i < out.length; i++) {
        if(out[i] !== BigInt(state.program[state.program.length - out.length + i])) {
            allMatch = false;
            if(i <= out.length - 2) {
                return; // Can't be fixed
            }
        }
    }

    // Check if the output happens to be the final answer
    if(allMatch && out.length === state.program.length) {
        // Note: this is guaranteed to be the lowest since the DFS always attempts
        //       the lowest octal values first.
        return a;
    }

    // Recurse by adding the next octal value
    for(let o = 0; o <= 7; o++) {
        const result = dfs([...octals, o]);
        if(result) {
            return result;
        }
    }
}

console.log(run({...state}).join(",")); // Part 1
console.log(dfs([0])); // Part 2
