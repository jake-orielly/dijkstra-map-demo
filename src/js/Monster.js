import Agent from "./Agent.js"
import utilities from "./utilities.js"
import goals from "./goals.js"

class Monster extends Agent {
    constructor(x, y, vue) {
        super(x,y,vue);
        this.type = "monster"
    }

    getNextStep(x, y) {
        let curr, newX, newY, newItem, inFrontier; 
        let frontier = [{
            x: x,
            y: y,
            g: 0,
            // Because the tile under an agent has not value, we can't actually calculate this, but we don't need to
            h: 0,
            p: 0
        }];
        let interior = {};
        while (frontier.length && !(this.vue.map[frontier[0].y][frontier[0].x].entity in goals)) {
            curr = frontier.shift();
            interior[`${curr.x}-${curr.y}`] = true;
            for (let dir of utilities.cardinalDirs) {
                newX = curr.x + dir[1];
                newY = curr.y + dir[0];
                if (!this.vue.onBoard(newX, newY) || !this.vue.isValidMove(newX, newY) || interior[`${newX}-${newY}`])
                    continue
                newItem = {
                    x: newX,
                    y: newY,
                    h: curr.g + this.vue.getTerrainVal(newX, newY),
                    g: this.vue.map[newY][newX].value
                }
                newItem.p = newItem.h + newItem.g;
                newItem.solution = (curr.solution ? curr.solution : [newX, newY])
                inFrontier = false;
                for (let i = frontier.length - 1; i >= 0; i--) {
                    if (newX == frontier[i].x && newY == frontier[i].y) {
                        if (newItem.p < frontier[i].p)
                            frontier.splice(i, 1);
                        else
                            inFrontier = true;
                        break;
                    }
                }
                if (!inFrontier) {
                    for (let i = frontier.length - 1; i >= 0; i--) {
                        if (newItem.p >= frontier[i].p) {
                            frontier.splice(i + 1, 0, newItem)
                            inFrontier = true;
                            break;
                        }
                    }
                    if (!inFrontier)
                        frontier.unshift(newItem)
                }
            }
        }
        if (!frontier.length)
            return [x, y];
        return frontier[0].solution;
    }
}

export default Monster;