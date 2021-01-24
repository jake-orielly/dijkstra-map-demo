class Agent {
    constructor(x, y, img, vue) {
        this.x = x;
        this.y = y;
        this.img = img;
        this.vue = vue;
        this.terrainDebt = 0;
        this.type = "agent";
        this.path = [];
    }

    step() {
        let nextStep, destTile;

        if (this.terrainDebt) {
            this.decTerrainDebt();
            return;
        }

        // Path should already be generated due to the generatePath function
        // But that approach, while true, is a little dicey
        nextStep = this.path[0];
        if (nextStep) {
            this.vue.map[this.y][this.x].entity = undefined;
            this.setY(nextStep[1]);
            this.setX(nextStep[0]);
            destTile = this.vue.map[nextStep[1]][nextStep[0]]
            destTile.entity = this;
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