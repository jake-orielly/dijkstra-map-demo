const cardinalDirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
];

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function getImgUrl(item) {
    if (item in goals)
        return require(`../assets/goals/${item}.png`)
    else
        return require(`../assets/${item}.png`)
}
import goals from "./goals.js";
export default {
    cardinalDirs,
    shuffleArray,
    getImgUrl
};