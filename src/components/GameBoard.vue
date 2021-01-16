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
                this.setCell(x,y,this.currSelection.value,this.map,"entity");
                if (this.currSelection.value == "dwarf")
                    this.agents.unshift(new Dwarf(x, y, this))
                else if (this.currSelection.value == "monster")
                    this.agents.push(new Monster(x, y, this))
                else if (this.currSelection.value in goals)
                    this.setCell(x,y,goals[this.currSelection.value].value,this.map,"value");
            }
            else if (this.currSelection.type == "terrain") {
                if (this.currSelection.value == "road" || this.currSelection.value == "wall") 
                    this.placeRoad(x,y,this.currSelection.value);
                else 
                    this.setCell(x,y,this.currSelection.value,this.map,"terrain");
            }
            for (let dir of utilities.cardinalDirs) {
                newX = x + dir[0];
                newY = y + dir[1];
                currTerrain = this.map[newY][newX].terrain[0].substr(0, 4);
                if (currTerrain == "road" || currTerrain == "wall") {
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
            if (roadTotal == 0 || roadTotal == 3 || roadTotal == 7)
                return `${type}s/${type}-10`;
            else if (roadTotal == 5 || roadTotal == 11)
                return `${type}s/${type}-16`;
            else
                return `${type}s/${type}-${roadTotal}`;
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
            else if (this.map[y][x].entity == "monster")
                return false;
            else
                return true;
        },
        onBoard(x,y) {
            return x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight;
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
                        toExpand.push([x,y,goals[this.map[y][x].entity].value])
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
            while (toExpand.length) {
                curr = toExpand.pop();
                if (this.isValidMove(curr[0],curr[1]))
                    for (let dir of utilities.cardinalDirs) {
                        let newX = curr[0] + dir[0];
                        let newY = curr[1] + dir[1];
                        if (this.onBoard(newX,newY)) {
                            if (this.map[newY][newX].entity in goals)
                                newVal = goals[this.map[newY][newX].entity].value;
                            else
                                newVal = curr[2] + this.getTerrainVal(newX, newY);
                            if (this.softSet(newX,newY,newVal)) {
                                toExpand.unshift([newX,newY,newVal])
                            }
                        }
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
            for (let agent of this.agents)
                this.expandPath(agent.getX(),agent.getY(), agent)
        },
        expandPath(x,y,agent) {
            this.setCell(x,y,agent.type,this.pathMap);
            let chosenDir = agent.getNextStep(x,y);
            if (chosenDir && !(chosenDir[0] == x && chosenDir[1] == y)) {
                this.setCell(chosenDir[0],chosenDir[1],agent.type,this.pathMap)
                this.expandPath(chosenDir[0],chosenDir[1], agent);
            }
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