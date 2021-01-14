const cardinalDirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
];

function getImgUrl(item) {
    if (item in goals)
        return require(`../assets/goals/${item}.png`)
    else
        return require(`../assets/${item}.png`)
}
import goals from "./goals.js";
export default {
    cardinalDirs,
    getImgUrl
};