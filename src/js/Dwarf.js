import Agent from "./Agent.js"
import utilities from "./utilities.js"
import goals from "./goals.js"

class Dwarf extends Agent {
    constructor(x, y, vue) {
        super(x, y, vue);
        this.type = "dwarf"
    }

    getPath() {
        let curr = this.getNextStep(this.getX(), this.getY());
        if (this.vue.map[this.getY()][this.getX()].value) {
            this.path = [];
            while (curr) {
                this.path.push(curr);
                curr = this.getNextStep(curr[0], curr[1]);
            }
        }
        else
            this.path = [];
    }

    getNextStep(x, y) {
        let minVal, chosenDir, newX, newY, newVal, newTile;
        // Our cue to stop searching
        if (this.vue.map[y][x].entity in goals)
            return;
        for (let dir of utilities.cardinalDirs) {
            newX = x + dir[1];
            newY = y + dir[0];
            if (this.vue.onBoard(newX, newY)) {
                newTile = this.vue.map[newY][newX];
                if (newTile.entity == "dwarf" || newTile.entity == "monster")
                    continue;
                if (newTile.entity in goals)
                    newVal = goals[newTile.entity].value;
                else if (!isNaN(parseInt(newTile.value)))
                    newVal = newTile.value;
                if ((minVal == undefined && newVal) || newVal < minVal) {
                    minVal = newVal;
                    chosenDir = [newX, newY];
                }
            }
        }
        return chosenDir;
    }
}

export default Dwarf;