<template>
    <table 
        cellspacing="0"
        @mouseleave="clearDrag"
    >
        <tr v-for="row in mapHeight" v-bind:key="row">
            <td v-for="cell in mapWidth" v-bind:key="row + ',' + cell" class="clickable"
                :style="{ backgroundColor: getColor(cell - 1, row - 1),
                border: (showingGridLines ? '1px solid black' : '')}"
                @click="cellClick(cell - 1,row - 1)"
                @mousedown="setDrag(cell - 1, row - 1, true)"
                @mouseup="setDrag(cell - 1, row - 1, false)"
                @mouseover="dragEvent(cell - 1, row - 1)"
            >
                <img 
                    v-if="map[row - 1][cell - 1].entity"
                    :src="getImgUrl(map[row - 1][cell - 1].entity)"
                    class="entity-img"
                >
                <img 
                    v-if="showingTerrain"
                    :src="getImgUrl(map[row - 1][cell - 1].terrain)"
                    class="terrain-img"
                >
                <span
                    v-if="shouldShow(cell - 1, row - 1)"
                >
                    {{map[row - 1][cell - 1].value}}
                </span>
                <div 
                    class="path-node" 
                    v-if="showingPath && pathMap[row-1][cell-1]"
                ></div>
            </td>
        </tr>
    </table>
</template>

<script>
import Agent from "../js/Agent.js"
import utilities from "../js/utilities.js"
import goals from "../js/goals.js"

export default {
    props: {
        currSelection: {
            type: Object,
            required: false
        },
        mapColor: {
            type: String,
            required: true
        },
        showingPath: {
            type: Boolean,
            required: true
        },
        showingValues: {
            type: Boolean,
            required: true
        },
        showingColors: {
            type: Boolean,
            required: true
        },
        showingTerrain: {
            type: Boolean,
            required: true
        },
        showingGridLines: {
            type: Boolean,
            required: true
        }
    },
    watch: {
        mapColor() {
            clearTimeout(this.colorUpdateTimeout);
            this.colorUpdateTimeout = setTimeout(
                () => { 
                    this.rgbMapColor = [
                        parseInt(this.mapColor.substr(1,2), 16),
                        parseInt(this.mapColor.substr(3,2), 16),
                        parseInt(this.mapColor.substr(5,2), 16)
                    ];
                }
            , 20);
        }
    },
    data() {
        return {
            mapHeight:14,
            mapWidth:18,
            map:[],
            pathMap:[],
            agents:[],
            draggable: ["erase"],
            maxVal:0,
            dragging: false,
            terrainVals: {
                road:1,
                plains:2,
                mountain:3,
            },
            rgbMapColor: [255,0,0],
            generateTimeout: undefined,
            colorUpdateTimeout: undefined
        }
    },
    created: function() {
        this.clearMap();
    },
	methods: {
        cellClick(x,y) {
            if (this.currSelection.value == "erase") {
                this.setCell(x,y,"",this.map,"value");
                this.setCell(x,y,undefined,this.map,"entity");
                this.setCell(x,y,this.getPlainsVal(),this.map,"terrain");
                this.agents = this.agents.filter(
                    agent => agent.getX() != x || agent.getY() != y
                );
            }
            else if (this.currSelection.type == "entity") {
                this.setCell(x,y,this.currSelection.value,this.map,"entity");
                if (this.currSelection.value == "agent")
                    this.agents.push(new Agent(x, y, this))
                else if (this.currSelection.value in goals)
                    this.setCell(x,y,goals[this.currSelection.value].value,this.map,"value");
            }
            else if (this.currSelection.type == "terrain") {
                if (this.currSelection.value == "road" || this.currSelection.value == "wall") 
                    this.placeRoad(x,y);
                else if (this.currSelection.value == "plains")
                    this.setCell(x,y,this.getPlainsVal,this.map,"terrain");
                else 
                    this.setCell(x,y,this.currSelection.value,this.map,"terrain");
            }
            if (this.dragging) {
                clearTimeout(this.generateTimeout);
                this.generateTimeout = setTimeout(
                    this.generate, 100
                );
            }
            else
                this.generate();
        },
        placeRoad(x,y) {
            let newX, newY;
            let value = this.computeTileNeighborValue(x,y,this.currSelection.value);
            this.setCell(x,y,value,this.map,"terrain");
            for (let dir of utilities.cardinalDirs) {
                newX = x + dir[1];
                newY = y + dir[0];
                // When we place a new road, we need to update the old ones
                if (this.onBoard(newX, newY) && this.map[newY][newX].terrain.substr(0,4) == this.currSelection.value) {
                    this.setCell(newX,newY,this.computeTileNeighborValue(newX,newY,this.currSelection.value),this.map,"terrain");
                }
            }
        },
        computeTileNeighborValue(x,y,type) {
            let newX, newY;
            let primeMap = {
                "-10":3,
                "01":5,
                "10":7,
                "0-1":11
            };
            let roadTotal = 0;
            for (let dir of utilities.cardinalDirs) {
                newX = x + dir[1];
                newY = y + dir[0];
                if (this.onBoard(newX, newY) && this.map[newY][newX].terrain.substr(0,4) == type) {
                    roadTotal += primeMap["" + dir[0] + dir[1]];
                }
            }
            if (roadTotal == 0 || roadTotal == 3 || roadTotal == 7)
                return `${type}s/${type}-10`;
            else if (roadTotal == 5 || roadTotal == 11)
                return `${type}s/${type}-16`;
            else
                return `${type}s/${type}-${roadTotal}`;
        },
        dragEvent(x,y) {
            if (this.dragging) {
                this.cellClick(x,y);
            }
        },
        setDrag(x,y,val) {
            if (this.draggable.indexOf(this.currSelection.value) != -1 || this.currSelection.type == "terrain") {
                this.dragging = val;
                if (val)
                    this.cellClick(x,y);
            }
        },
        clearDrag() {
            this.dragging = false;
        },
        shouldShow(x,y) {
            if (this.map[y][x].terrain.substr(0,4) == "wall" || this.map[y][x].entity)
                return false;
            return this.showingValues || isNaN(this.map[y][x].value)
        },
        isEmpty(x,y) {
            if (this.map[y][x].terrain.substr(0,4) == "wall")
                return false;
            return !isNaN(this.map[y][x].value) || this.map[y][x].value == " ";
        },
        onBoard(x,y) {
            return x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight;
        },
        getColor(x,y) {
            if (!this.showingColors || isNaN(this.map[y][x].value))
                return "rgba(0,0,0,0)";
            else
                return `rgba(${this.rgbMapColor.join(",")},${(this.map[y][x].value / this.maxVal) * 0.7})`;
        },
        step() {
            for (let ind = 0; ind < this.agents.length; ind++)
                this.agents[ind].step();
            this.generate();
        },
        generate() {
            let toExpand = [];
            this.maxVal = 0;
            this.resetMap();
            for (let y = 0; y < this.mapHeight; y++)
                for (let x = 0; x < this.mapWidth; x++) 
                    if (this.map[y][x].entity in goals)
                        for (let dir of utilities.cardinalDirs) {
                            let newX = x + dir[0];
                            let newY = y + dir[1];
                            if (this.onBoard(newX,newY))
                                toExpand.push([newX,newY])
                        }
            this.expand(toExpand);
            this.generatePath();
            for (let y = 0; y < this.mapHeight; y++)
                for (let x = 0; x < this.mapWidth; x++)
                    if (!isNaN(this.map[y][x].value))
                        this.maxVal = Math.max(this.map[y][x].value,this.maxVal)
        },
        expand(toExpand) {
            let curr, newVal;
            let iters = 0;
            console.time("expand");
            while (toExpand.length) {
                iters++;
                curr = toExpand.pop();
                if (this.isEmpty(curr[0],curr[1]))
                    for (let dir of utilities.cardinalDirs) {
                        let newX = curr[0] + dir[0];
                        let newY = curr[1] + dir[1];
                        if (this.onBoard(newX,newY)) {
                            if (this.map[newY][newX].entity in goals)
                                newVal = goals[this.map[newY][newX].entity].value;
                            else if (this.map[curr[1]][curr[0]].value == " ")
                                newVal = this.getTerrainVal(newX, newY);
                            else
                                newVal = this.map[curr[1]][curr[0]].value + 
                                this.getTerrainVal(newX, newY);
                            if (this.softSet(newX,newY,newVal)) 
                                toExpand.push([newX,newY])
                        }
                    }
            }
            console.log(iters);
            console.timeEnd("expand");
        },
        softSet(x,y,val) {
            if (
                (!isNaN(this.map[y][x].value) && val < this.map[y][x].value)
                || this.map[y][x].value == " "
            ){
                this.setCell(x,y,val,this.map,"value");
                return true;
            }
            else
                return false;
        },
        getTerrainVal(x,y) {
            let terrain = this.map[y][x].terrain;
            if (terrain.substr(0,4) == "road")
                terrain = "road";
            else if (terrain.substr(0,6) == "plains")
                terrain = "plains";
            return this.terrainVals[terrain];
        },
        generatePath() {
            for (let agent of this.agents)
                this.expandPath(agent.getX(),agent.getY(), agent)
        },
        expandPath(x,y,agent) {
            this.setCell(x,y,"1",this.pathMap);
            let chosenDir = agent.getNextStep(x,y);
            if (chosenDir) {
                this.setCell(chosenDir[0],chosenDir[1],"1",this.pathMap)
                this.expandPath(chosenDir[0],chosenDir[1], agent);
            }
        },
        setCell(x,y,val,arr,prop) {
            let row = arr[y]
            if (prop && arr[y][x][prop] != val) {
                row[x][prop] = val;
                this.$set(arr, y, row);
            }
            else if (!prop && arr[y][x] != val) {
                row[x] = val;
                this.$set(arr, y, row);
            }
        },
        resetMap() {
            for (let y = 0; y < this.mapHeight; y++)
                for (let x = 0; x < this.mapWidth; x++) {
                    if (!isNaN(this.map[y][x].value))
                        this.setCell(x,y," ",this.map,"value");
                    if (!isNaN(this.pathMap[y][x]))
                        this.setCell(x,y,"",this.pathMap);
                }
        },
        clearMap() {
            this.map = [];
            this.pathMap = [];
            this.agents = [];
            for (let y = 0; y < this.mapHeight; y++) {
                this.map.push([]);
                this.pathMap.push([]);
                for (let x = 0; x < this.mapWidth; x++) {
                    this.map[y].push({
                        value:"",
                        entity:undefined,
                        terrain:this.getPlainsVal()
                    });
                    this.pathMap[y].push("");
                }
            }
        },
        getPlainsVal() {
            return `plains/plains-${parseInt(Math.random() * 4)}`;
        },
        getImgUrl(item) {
            return utilities.getImgUrl(item);
        }
    }
};
</script>

<style scoped>
table {
    border: 3px solid black;
    box-shadow: 4px 5px 11px #868181;
}

img, td {
    height: 3rem;
    width: 3rem;
}

td {
    position: relative;
    font-size: 2rem;
    text-align: center;
    margin: 0;
    padding: 0;
}

span {
    z-index: 3;
}

.terrain-img, .entity-img {
    position: absolute;
    top: 0;
    left: 0;
}

.terrain-img {
    z-index: -1;
}

.entity-img {
    z-index: 2;
}

.path-node {
    position: absolute;
    width: 1rem;
    height: 1rem;
    border-radius: 1rem;
    bottom: 0rem;
    background-color: blue;
    z-index: 2;
}
</style>