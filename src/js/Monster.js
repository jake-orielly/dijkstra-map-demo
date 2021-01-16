import Agent from "./Agent.js"
import utilities from "./utilities.js"
import goals from "./goals.js"

class Monster extends Agent {
    constructor(x, y, vue) {
        super(x,y,vue);
        this.type = "monster"
        this.lastMove = [-1, -1];
    }

    step() {
        let oldX = this.x;
        let oldY = this.y;
        Agent.prototype.step.call(this);
        if (this.x != oldX || this.y != oldY)
            this.lastMove = [oldX, oldY];
        for (let i = 0; i < this.vue.agents.length; i++)
            if(this.vue.agents[i].x == this.x && this.vue.agents[i].y == this.y && this.vue.agents[i].type == "dwarf")
                this.vue.agents.splice(i, 1);
    }

    getNextStep(x, y) {
        let curr, newX, newY, newItem, inFrontier, dwarfMap, lastMovePenalty, terrainVal; 
        let invalidEntities = ["monster", ...Object.keys(goals)];
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
                if (!this.vue.onBoard(newX, newY) || 
                    !this.vue.isValidMove(newX, newY) || 
                    invalidEntities.indexOf(this.vue.map[newY][newX].entity) != -1 ||
                    interior[`${newX}-${newY}`])
                    continue
                newItem = {
                    x: newX,
                    y: newY,
                    h: curr.g + this.vue.getTerrainVal(newX, newY),
                }
                dwarfMap = dwarves.map(d => Math.abs(d.x - newX) + Math.abs(d.y - newY))
                newItem.g = Math.min.apply(Math, dwarfMap)
                newItem.solution = (curr.solution ? curr.solution : [newX, newY])
                // Heavy penalty for the tile we were just on, prevent back and forth
                lastMovePenalty = (this.lastMove[0] == newItem.solution[0] && this.lastMove[1] == newItem.solution[1] ? 0.5 : 0)
                // Slight penalty for tiles based on distance from nearest treasure
                terrainVal = (this.vue.map[newY][newX].value == undefined ? 0 : this.vue.map[newY][newX].value/1000);
                newItem.p = newItem.h + newItem.g + lastMovePenalty + terrainVal;
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
                        if (newItem.p > frontier[i].p) {
                            frontier.splice(i + 1, 0, newItem)
                            inFrontier = true;
                            break;
                        }
                        else if (newItem.p == frontier[i].p) {
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