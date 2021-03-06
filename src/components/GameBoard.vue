<template>
    <table 
        cellspacing="0"
        @mouseleave="clearDrag"
    >
        <tr v-for="row in mapHeight" v-bind:key="row">
            <Tile
                v-for="cell in mapWidth" 
                v-bind:key="row + ',' + cell"
                :tile="map[row - 1][cell - 1]"
                :x="cell - 1"
                :y="row - 1"
                :showingValues="showingValues"
                :showingGridLines="showingGridLines"
                :showingColors="showingColors"
                :showingTerrain="showingTerrain"
                :showingPath="shouldShowPath(cell - 1, row - 1)"
                :maxVal="maxVal"
                :rgbMapColor="rgbMapColor"
                @click="cellClick"
                @setDrag="setDrag"
                @dragEvent="dragEvent"
            />
        </tr>
    </table>
</template>

<script>
import Tile from "./Tile.vue"

import Dwarf from "../js/Dwarf.js"
import Monster from "../js/Monster.js"
import utilities from "../js/utilities.js"
import goals from "../js/goals.js"

export default {
    components: {
        Tile
    },
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
            mapHeight:21,
            mapWidth:21,
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
            colorUpdateTimeout: undefined
        }
    },
    created: function() {
        this.clearMap();
    },
	methods: {
        cellClick(x,y) {
            let newX, newY, currTerrain;
            if (this.currSelection.value == "erase") {
                this.setCell(x,y,undefined,this.map,"value");
                this.setCell(x,y,undefined,this.map,"entity");
                this.setCell(x,y,undefined,this.map,"terrain");
                this.agents = this.agents.filter(
                    agent => agent.getX() != x || agent.getY() != y
                );
            }
            else if (this.currSelection.type == "entity") {
                let newEntity;
                this.removeAgent(x,y)
                if (this.currSelection.value == "dwarf") {
                    // TODO: Clean up this $parent tool thing   
                    newEntity = new Dwarf(x, y, this.$parent.entityTools[0].img, this);
                    this.agents.push(newEntity)
                    this.$parent.entityTools[0].img = utilities.getImgUrl("dwarf");
                }
                else if (this.currSelection.value == "monster") {
                    newEntity = new Monster(x, y, this.$parent.entityTools[1].img, this);
                    this.agents.unshift(newEntity)
                    this.$parent.entityTools[1].img = utilities.getImgUrl("monster");
                }
                else if (this.currSelection.value in goals) {
                    newEntity = {
                        type: this.currSelection.value,
                        img:utilities.getImgUrl(this.currSelection.value)
                    };
                    this.setCell(x,y,goals[this.currSelection.value].value,this.map,"value");
                }
                if (this.map[y][x].terrain[0].substr(0, 4) == "wall") {
                    this.map[y][x].terrain.shift();
                }
                this.setCell(x,y,newEntity,this.map,"entity");
            }
            else if (this.currSelection.type == "terrain") {
                if (this.currSelection.value == "road" || this.currSelection.value == "wall") 
                    this.placeRoad(x,y,this.currSelection.value);
                else 
                    this.setCell(x,y,this.currSelection.value,this.map,"terrain");
                if (this.currSelection.value == "wall") {
                    this.setCell(x,y,undefined,this.map,"entity");
                    this.removeAgent(x,y);
                }
            }
            for (let dir of utilities.cardinalDirs) {
                newX = x + dir[0];
                newY = y + dir[1];
                if (this.onBoard(newX, newY)) {
                    currTerrain = this.map[newY][newX].terrain[0].substr(0, 4);
                    if (currTerrain == "road" || currTerrain == "wall") 
                        this.placeRoad(newX,newY,currTerrain);
                }
            }
            this.generate();
        },
        placeRoad(x,y, type) {
            let newX, newY;
            let value = this.computeTileNeighborValue(x,y,type);
            this.setCell(x,y,value,this.map,"terrain");
            for (let dir of utilities.cardinalDirs) {
                newX = x + dir[1];
                newY = y + dir[0];
                // When we place a new road, we need to update the old ones
                if (this.onBoard(newX, newY) && this.map[newY][newX].terrain[0].substr(0,4) == this.currSelection.value) {
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
                if (this.onBoard(newX, newY) && this.map[newY][newX].terrain[0].substr(0,4) == type) {
                    roadTotal += primeMap["" + dir[0] + dir[1]];
                }
            }
            return `${type}s/${type}-${roadTotal}`;
        },
        removeAgent(x, y) {
            if (this.map[y][x].entity)
                for (let i = 0; i < this.agents.length; i++)
                    if (this.agents[i].x == x && this.agents[i].y == y) {
                        this.agents.splice(i, 1);
                        break;
                    }
        },
        dragEvent(x,y) {
            if (this.dragging)
                this.cellClick(x,y);
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
        isValidMove(x,y) {
            if (this.map[y][x].terrain[0].substr(0,4) == "wall")
                return false;
            else if (utilities.getType(this.map[y][x]) == "monster")
                return false;
            else
                return true;
        },
        onBoard(x,y) {
            return x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight;
        },
        step() {
            for (let ind = 0; ind < this.agents.length; ind++) {
                this.agents[ind].getPath();
                this.agents[ind].step();
            }
            this.generate();
        },
        generate() {
            let toExpand = [];
            this.maxVal = 0;
            this.resetMap();
            for (let y = 0; y < this.mapHeight; y++)
                for (let x = 0; x < this.mapWidth; x++) 
                    if (utilities.getType(this.map[y][x]) in goals)
                        toExpand.push([x,y,goals[utilities.getType(this.map[y][x])].value])
            if (!toExpand)
                this.clearVals();
            this.expand(toExpand);
            this.generatePath();
            for (let y = 0; y < this.mapHeight; y++)
                for (let x = 0; x < this.mapWidth; x++)
                    if (!isNaN(this.map[y][x].value))
                        this.maxVal = Math.max(this.map[y][x].value,this.maxVal)
        },
        expand(toExpand) {
            let curr, newVal;
            let loopCount = 0;
            let emergencyMax = 10000;
            while (toExpand.length) {
                curr = toExpand.pop();
                if (this.isValidMove(curr[0],curr[1]))
                    for (let dir of utilities.cardinalDirs) {
                        let newX = curr[0] + dir[0];
                        let newY = curr[1] + dir[1];
                        if (this.onBoard(newX,newY)) {
                            if (utilities.getType(this.map[newY][newX]) in goals)
                                newVal = goals[utilities.getType(this.map[newY][newX])].value;
                            else if (this.getTerrainVal(newX, newY) == undefined)
                                newVal = undefined;
                            else
                                newVal = curr[2] + this.getTerrainVal(newX, newY);
                            if (this.softSet(newX,newY,newVal)) {
                                toExpand.unshift([newX,newY,newVal])
                            }
                        }
                    }
                loopCount++;
                if (loopCount > emergencyMax) {
                    console.error("While loop out of control in expand")
                    break;
                }
            }
        },
        clearVals() {
            for (let y = 0; y < this.mapHeight; y++)
                for (let x = 0; x < this.mapWidth; x++) 
                    this.setCell(x,y,undefined,this.map,"value");
        },
        softSet(x,y,val) {
            if (
                (!isNaN(this.map[y][x].value) && val < this.map[y][x].value)
                || this.map[y][x].value === undefined
            ){
                this.setCell(x,y,val,this.map,"value");
                return true;
            }
            else
                return false;
        },
        getTerrainVal(x,y) {
            let terrain = this.map[y][x].terrain[0];
            if (terrain.substr(0,4) == "road")
                terrain = "road";
            else if (terrain.substr(0,6) == "plains")
                terrain = "plains";
            return this.terrainVals[terrain];
        },
        generatePath() {
            for (let agent of this.agents) {
                agent.getPath();
                this.markPath(agent);
            }
        },
        markPath(agent) {
            if (agent.path.length)
                this.setCell(agent.getX(),agent.getY()  ,agent.type,this.pathMap);
            for (let node of agent.path)
                this.setCell(node[0],node[1],agent.type,this.pathMap);
        },
        setCell(x,y,val,arr,prop) {
            let row = arr[y]
            if (prop == "terrain") {
                if (row[x][prop].length > 1)
                    row[x][prop].shift();
                if (val != undefined && val != "plains") 
                    row[x][prop].unshift(val);
            }
            else if (prop && arr[y][x][prop] != val) {
                row[x][prop] = val;
                this.$set(arr, y, row);
            }
            else if (!prop && val[0]) {
                if (row[x].indexOf(val) == -1) {
                    row[x].push(val);
                    this.$set(arr, y, row);
                }
            }
            else if (!prop) {
                row[x] = val;
                this.$set(arr, y, row);
            }
        },
        resetMap() {
            for (let y = 0; y < this.mapHeight; y++)
                for (let x = 0; x < this.mapWidth; x++) {
                    if (!isNaN(this.map[y][x].value))
                        this.setCell(x,y,undefined,this.map,"value");
                    this.setCell(x,y,[],this.pathMap);
                }
        },
        shouldShowPath(x, y) {
            if (this.showingPath)
                return this.pathMap[y][x];
            else
                return [];
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
                        value:undefined,
                        entity:undefined,
                        terrain:[this.getPlainsVal()]
                    });
                    this.pathMap[y].push([]);
                }
            }
        },
        getPlainsVal() {
            return `plains/plains-${parseInt(Math.random() * 4)}`;
        },
    }
};
</script>

<style scoped>
table {
    border: 3px solid black;
    box-shadow: 4px 5px 11px #868181;
}
</style>