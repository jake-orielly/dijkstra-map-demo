const cardinalDirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
];

let dwarfBag = [];

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function getType(tile) {
    if (tile.entity)
        return tile.entity.type;
}

function getImgUrl(item) {
    if (item in goals)
        return require(`../assets/goals/${item}.png`)
    if (item == "dwarf") {
        if (!dwarfBag.length)
            fillDwarfBag();
        return require(`../assets/dwarves/${dwarfBag.pop()}.png`);
    }
    else
        return require(`../assets/${item}.png`)
}

function fillDwarfBag() {
    let numDwarfImages = 5;
    for (let i = 0; i < numDwarfImages; i++)
        dwarfBag.push(`dwarf-${i}`);
    dwarfBag = shuffleArray(dwarfBag);
}

import goals from "./goals.js";
export default {
    cardinalDirs,
    shuffleArray,
    getType,
    getImgUrl
};