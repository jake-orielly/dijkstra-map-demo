import Agent from "./Agent.js"
import utilities from "./utilities.js"
import goals from "./goals.js"

class Dwarf extends Agent {
    constructor(x, y, vue) {
        super(x, y, vue);
        this.type = "dwarf"
    }

    getNextStep(x, y) {
        let minVal, chosenDir, newX, newY, newVal, newTile;
        let currVal = this.vue.map[y][x].value;
        if (this.vue.map[y][x].entity in goals)
            currVal = goals[this.vue.map[y][x].entity].value;
        // parseInt b/c of weird behavior isNaN(" ") => false
        if (!isNaN(parseInt(this.vue.map[y][x].value)))
            minVal = this.vue.map[y][x].value;
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
        if (minVal < currVal || (x == this.getX() && y == this.getY()))
            return chosenDir;
    }
}

export default Dwarf;