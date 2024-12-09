/* Insert AoC day 9 input here */
let input = "2333133121414131402"

const files = [];
const space = [];

// Parse
let head = 0;
let fileId = 0;
for(let i = 1; i <= input.length; i += 2) {
    const fileSize = +input[i - 1];
    const freeSpace = +(input[i] ?? 0);

    files.push({
        start: head,
        length: fileSize,
        end: head + fileSize,
        id: fileId,
    });

    let j = head;
    for(; j < head + fileSize; j++) {
        space[j] = fileId;
    }
    for(; j < head + fileSize + freeSpace; j++) {
        space[j] = '.';
    }

    fileId++;
    head += fileSize + freeSpace;
}

function checksum(space) {
    let checksum = 0;
    for(let i = 0; i < space.length; i++) {
        if(space[i] === '.') continue;
        checksum += i * space[i];
    }
    return checksum;
}

// Part 1
let firstFreeSpace = -1;
function findNextFreeSpace() {
    for(let j = firstFreeSpace + 1; j < space.length; j++) {
        if(space[j] === '.') {
            firstFreeSpace = j;
            break;
        }
    }
}
findNextFreeSpace();

// Compact
for(let j = space.length - 1; j > 0; j--) {
    if(space[j] !== '.') {
        space[firstFreeSpace] = space[j];
        space[j] = '.'
        findNextFreeSpace();
        if(firstFreeSpace >= j) {
            break;
        }
    }
}
console.log(checksum(space));

// Part 2
const newFiles = [...files]
for(let fileIndex = files.length - 1; fileIndex > 0; fileIndex--) {
    const file = files[fileIndex];

    // Find slot
    for(let i = 0; i < newFiles.length - 1; i++) {
        if(newFiles[i].id === file.id) break;

        if(newFiles[i + 1].start - newFiles[i].end >= file.length) {
            // Move
            const end = newFiles[i].end;
            newFiles.splice(newFiles.findIndex(f => f.id === fileIndex), 1);
            newFiles.splice(i + 1, 0, file);

            // Fixup pointers
            file.start = end;
            file.end = file.start + file.length;
            break;
        }
    }
}

function toSpace(files) {
    const space = [];
    let j = 0;
    for(const file of files) {
        for(; j < file.start; j++) {
            space[j] = '.';
        }
        for(; j < file.start + file.length; j++) {
            space[j] = file.id;
        }
    }
    return space;
}

console.log(checksum(toSpace(newFiles)));