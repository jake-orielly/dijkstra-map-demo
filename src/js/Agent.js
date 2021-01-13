import cardinalDirs from "../js/utilities.js"
import goals from "../js/goals.js"

class Agent {
    constructor(x, y, vue) {
        this.x = x;
        this.y = y;
        this.vue = vue;
        this.terrainDebt = 0;
    }

    step() {
        let chosenDir, destTile;

        if (this.terrainDebt) {
            this.decTerrainDebt();
            return;
        }

        chosenDir = this.getNextStep(this.x, this.y);
        if (chosenDir) {
            this.vue.map[this.y][this.x].value = "";
            this.setY(chosenDir[1]);
            this.setX(chosenDir[0]);
            destTile = this.vue.map[chosenDir[1]][chosenDir[0]]
            destTile.value = "A";
            this.setTerrainDebt(
                this.vue.getTerrainVal(this.getX(), this.getY()) - 1
            );
        }
    }

    getNextStep(x,y) {
        let minVal, chosenDir, newX, newY, newVal, newMapVal;
        let currVal = this.vue.map[y][x].value;
        if (currVal in goals)
            currVal = goals[currVal];
        // parseInt b/c of weird behavior isNaN(" ") => false
        if (!isNaN(parseInt(this.vue.map[y][x].value)))
            minVal = this.vue.map[y][x].value;
        for (let dir of cardinalDirs) {
            newX = x + dir[1];
            newY = y + dir[0];
            if (this.vue.onBoard(newX,newY)) {
                newMapVal = this.vue.map[newY][newX].value;
                if (!isNaN(parseInt(newMapVal)))
                    newVal = newMapVal;
                else if (newMapVal in goals)
                    newVal = goals[newMapVal];
                else 
                    continue
            }
            if (minVal == undefined || newVal < minVal) {
                minVal = newVal;
                chosenDir = [newX,newY];
            }
        }
        if (minVal < currVal || (x == this.getX() && y == this.getY()))
            return chosenDir;
    }

    getX() {
        return this.x;
    }

    setX(val) {
        this.x = val;
    }

    getY() {
        return this.y;
    }

    setY(val) { 
        this.y = val;
    }

    getTerrainDebt() {
        return this.terrainDebt;
    }

    setTerrainDebt(val) {
        this.terrainDebt = val;
    }

    decTerrainDebt() {
        this.terrainDebt--;
    }
}

export default Agent;