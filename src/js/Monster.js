import Agent from "./Agent.js"
import utilities from "./utilities.js"

class Monster extends Agent {
    constructor(x, y, vue) {
        super(x,y,vue);
        this.type = "monster"
    }

    step() {
        Agent.prototype.step.call(this);
        for (let i = 0; i < this.vue.agents.length; i++)
            if(this.vue.agents[i].x == this.x && this.vue.agents[i].y == this.y && this.vue.agents[i].type == "dwarf")
                this.vue.agents.splice(i, 1)
    }

    getNextStep(x, y) {
        let curr, newX, newY, newItem, inFrontier, dwarfMap; 
        let frontier = [{
            x: x,
            y: y,
            g: 0,
            // Because the tile under an agent has not value, we can't actually calculate this, but we don't need to
            h: 0,
            p: 0
        }];
        let interior = {};
        let dwarves = this.vue.agents.filter(agent => agent.type == "dwarf");
        if (!dwarves.length)
            return undefined;
        while (frontier.length && !(this.vue.map[frontier[0].y][frontier[0].x].entity == "dwarf")) {
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
                }
                dwarfMap = dwarves.map(d => Math.abs(d.x - newX) + Math.abs(d.y - newY))
                newItem.g = Math.min.apply(Math, dwarfMap)
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
            return undefined;
        return frontier[0].solution;
    }
}

export default Monster;