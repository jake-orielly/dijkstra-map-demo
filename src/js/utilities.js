const cardinalDirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
];

function getImgUrl(item) {
    let img;
    if (item in goals) {
        img = goals[item].img;
        return require(`../assets/goals/${img}.png`)
    }
    else if (item == "A")
        return require(`../assets/agent.png`)
    else
        return require(`../assets/${item}.png`)
}
import goals from "./goals.js";
export default {
    cardinalDirs,
    getImgUrl
};