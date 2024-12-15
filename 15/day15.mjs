let input = [
    /* Insert AoC day 14 input here */
    "##########",
    "#..O..O.O#",
    "#......O.#",
    "#.OO..O.O#",
    "#..O@..O.#",
    "#O#..O...#",
    "#O..O..O.#",
    "#.OO.O.OO#",
    "#....O...#",
    "##########",
    "",
    "<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^",
    "vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v",
    "><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<",
    "<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^",
    "^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><",
    "^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^",
    ">^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^",
    "<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>",
    "^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>",
    "v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^",
]

let newline = input.indexOf("");
let boardLines = input.slice(0, newline);
let instructions = input.slice(newline).join('').trim();

let posX = -1;
let posY = -1
const boxes = [];

let board = {};
const getKey = (x,y) => `${x}x${y}`;
const setValue = (board, x, y, value) => {
    board[getKey(x, y)] = value;
}
const getValue = (board, x, y, fallback = null) => {
    return board[getKey(x, y)] ?? fallback
}
const printBoard = (board, xi, yi, width, height) => {
    for(let y = yi; y < height; y++) {
        let line = ""
        for(let x = xi; x < width; x++) {
            let v  = getValue(board, x, y, '.');
            if(x === posX && y === posY) {
                line += '@';
            } else {
                const box = boxes.find(b => b.y === y && (b.x === x || b.x + 1 === x));
                if(box) {
                    line += box.x === x ? '[' : ']';
                } else {
                    line += v;
                }
            }
        }
        console.log(line);
    }
}

// Part 1
{
    const height = boardLines.length;
    const width = boardLines[0].length;
    for(let y = 0; y < boardLines.length; y++) {
        for(let x = 0; x < boardLines[y].length; x++) {
            if(boardLines[y][x] === '@') {
                posX = x;
                posY = y;
                setValue(board, x, y, '.');
            } else {
                setValue(board, x, y, boardLines[y][x]);
            }
        }
    }

    for(let i of instructions) {
        let dx = 0;
        let dy = 0;
        if(i === '<') {
            dx = -1;
        } else if(i === '>') {
            dx = 1;
        } else if(i === '^') {
            dy = -1;
        } else {
            dy = 1;
        }

        // Check ahead
        let steps = 1;
        let ahead = getValue(board, posX + dx*steps, posY + dy*steps);
        while(ahead !== '#') {
            if(ahead === '.') {
                break;
            }

            steps++;
            ahead = getValue(board, posX + dx*steps, posY + dy*steps);
        }

        if(ahead !== '#') {
            for(let j = steps; j > 0; j--) {
                setValue(board, posX + dx*j, posY + dy*j, j === 1 ? '.' : 'O');
            }

            posX += dx;
            posY += dy;
        }
    }
    printBoard(board, 0, 0, width, height)

    let sum = 0;
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            if(getValue(board, x, y) === 'O') {
                sum += y * 100 + x;
            }
        }
    }
    console.log(sum);
}

// Part 2
{
    board = {};
    const height = boardLines.length;
    const width = boardLines[0].length * 2;
    for(let y = 0; y < boardLines.length; y++) {
        for(let x = 0; x < boardLines[y].length; x++) {
            if(boardLines[y][x] === '@') {
                posX = x*2;
                posY = y;
                setValue(board, x*2, y, '.');
                setValue(board, x*2 + 1, y, '.');
            } else {
                if(boardLines[y][x] === 'O') {
                    boxes.push({x: x*2, y: y});
                } else {
                    setValue(board, x*2, y, boardLines[y][x]);
                    setValue(board, x*2 + 1, y, boardLines[y][x]);
                }
            }
        }
    }

    function findAllBoxes(posX, posY, dx, dy, self = null) {
        const result = [];
        const box = boxes.find(b => (b.x === (posX + dx) || b.x + 1 === (posX + dx)) && b.y === (posY + dy));
        if(box && box !== self) {
            result.push(box);
            result.push(...findAllBoxes(box.x, box.y, dx, dy, box))
            result.push(...findAllBoxes(box.x + 1, box.y, dx, dy, box))
        }

        if(getValue(board, posX + dx, posY + dy) === '#') {
            // Can't move
            throw new Error('Hit a wall');
        }

        return result;
    }

    for(let i of instructions) {
        let dx = 0;
        let dy = 0;
        if(i === '<') {
            dx = -1;
        } else if(i === '>') {
            dx = 1;
        } else if(i === '^') {
            dy = -1;
        } else {
            dy = 1;
        }

        // Check ahead
        try {
            const moving = new Set(findAllBoxes(posX, posY, dx, dy));
            for(const b of moving) {
                b.x += dx;
                b.y += dy;
            }
            posX += dx;
            posY += dy;
        } catch(e) {}
    }
    printBoard(board, 0, 0, width, height)

    let sum = 0;
    for(const box of boxes) {
        sum += box.y * 100 + box.x;
    }
    console.log(sum);
}

