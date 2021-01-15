class Agent {
    constructor(x, y, vue) {
        this.x = x;
        this.y = y;
        this.vue = vue;
        this.terrainDebt = 0;
        this.type = "agent";
    }

    step() {
        let chosenDir, destTile;

        if (this.terrainDebt) {
            this.decTerrainDebt();
            return;
        }

        chosenDir = this.getNextStep(this.x, this.y);
        if (chosenDir) {
            this.vue.map[this.y][this.x].entity = undefined;
            this.setY(chosenDir[1]);
            this.setX(chosenDir[0]);
            destTile = this.vue.map[chosenDir[1]][chosenDir[0]]
            destTile.entity = this.type;
            this.setTerrainDebt(
                this.vue.getTerrainVal(this.getX(), this.getY()) - 1
            );
        }
    }
    
    getNextStep(x, y) {
        return [x, y]
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