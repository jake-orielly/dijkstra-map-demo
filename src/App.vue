<template>
  <div>
    <table cellspacing="0">
        <tr v-for="row in mapHeight" v-bind:key="row">
            <td v-for="cell in mapWidth" v-bind:key="row + ',' + cell" class="clickable"
                :style="{ backgroundColor: getColor(cell - 1, row - 1)}"
                @click="cellClick(cell - 1,row - 1)"
                @mousedown="setDrag(cell - 1, row - 1, true)"
                @mouseup="setDrag(cell - 1, row - 1, false)"
                @mouseover="dragEvent(cell - 1, row - 1)"
            >
                {{map[row - 1][cell - 1]}}
                <div class="path-node" v-if="pathMap[row-1][cell-1]"></div>
            </td>
        </tr>
    </table>
    <div id="selection-container">
        <p v-for="item in selections" v-bind:key="item" class="clickable selection"
            @click="setSelection(item)" :class="[currSelection == item ? 'selected' : '']"
        >
            {{item}}
        </p>
    </div>
    <div>
        <button @click="generate">Generate</button>
        <button @click="clearMap">Clear</button>
    </div>
    <Toggle ref="toggle"></Toggle>
  </div>
</template>

<script src="./main.js">
</script>

<script>
import Toggle from './components/Toggle.vue'

const cardinalDirs = [
    [1,0],
    [0,1],
    [-1,0],
    [0,-1]
];

const diagonalDirs = [
    [1,0],
    [0,1],
    [-1,0],
    [0,-1],
    [1,1],
    [-1,1],
    [-1,-1],
    [1,-1]
];

export default {
  name: 'App',
  components: {
        Toggle
    },
    data: function() {
        return {
            mapHeight:10,
            mapWidth:14,
            map:[],
            pathMap:[],
            selections:["A","G","W"," "],
            draggable: ["W"," "],
            currSelection:undefined,
            maxVal:0,
            dragging: false,
            selectedDir: cardinalDirs
        }
    },
    methods: {
        cellClick(x,y) {
            this.setCell(x,y,this.currSelection,this.map);
            this.generate();
        },
        setSelection(selection) {
            this.currSelection = selection;
        },
        generate() {
            let toExpand = [];
            let agents = [];
            this.maxVal = 0;
            this.resetMap();
            for (let y = 0; y < this.mapHeight; y++)
                for (let x = 0; x < this.mapWidth; x++) 
                    if (this.map[y][x] == "G")    
                        for (let dir of this.selectedDir) {
                            let newX = x + dir[0];
                            let newY = y + dir[1];
                            if (this.onBoard(newX,newY)) {
                                this.softSet(newX,newY,1);
                                toExpand.push([newX,newY])
                            }
                        }
                    else if (this.map[y][x] == "A")
                        agents.push([y,x])
            this.expand(toExpand);
            this.generatePath(agents);
            for (let y = 0; y < this.mapHeight; y++)
                for (let x = 0; x < this.mapWidth; x++)
                    if (!isNaN(this.map[y][x]))
                        this.maxVal = Math.max(this.map[y][x],this.maxVal)
        },
        expand(toExpand) {
            let curr;
            while (toExpand.length) {
                curr = toExpand.pop();
                if (this.isEmpty(curr[0],curr[1]))
                    for (let dir of this.selectedDir) {
                        let newX = curr[0] + dir[0];
                        let newY = curr[1] + dir[1];
                        let newVal = this.map[curr[1]][curr[0]] + 1;
                        if (this.onBoard(newX,newY)) {
                            if (this.softSet(newX,newY,newVal)) 
                                toExpand.push([newX,newY])
                        }
                    }
            }
        },
        generatePath(agents) {
            let currX, currY;
            for (let agent of agents)
                this.expandPath(agent[1],agent[0])
        },
        expandPath(x,y) {
            this.setCell(x,y,"1",this.pathMap);
            let baseVal = this.map[y][x];
            let minVal, chosenDir, newX, newY;

            // parseInt b/c of weird behavior isNaN(" ") => false
            if (!isNaN(parseInt(this.map[y][x])))
                minVal = this.map[y][x];
            console.log(minVal)
            for (let dir of this.selectedDir) {
                newX = x + dir[1];
                newY = y + dir[0];
                if (this.onBoard(newX,newY) &&
                !isNaN(parseInt(this.map[newY][newX])) && 
                (minVal == undefined || this.map[newY][newX] < minVal)) {
                    minVal = this.map[newY][newX];
                    chosenDir = [newX,newY];
                }
            }
            if (chosenDir) {
                this.setCell(chosenDir[0],chosenDir[1],"1",this.pathMap)
                this.expandPath(chosenDir[0],chosenDir[1]);
            }
        },
        softSet(x,y,val) {
            if (
                (!isNaN(this.map[y][x]) && val < this.map[y][x])
                || this.map[y][x] == " "
            ){
                this.setCell(x,y,val,this.map);
                return true;
            }
            else
                return false;
        },
        setCell(x,y,val,arr) {
            if (arr[y][x] != val) {
                let row = arr[y]
                row[x] = val;
                this.$set(arr, y, row);
            }
        },
        resetMap() {
            for (let y = 0; y < this.mapHeight; y++)
                for (let x = 0; x < this.mapWidth; x++) {
                    if (!isNaN(this.map[y][x]))
                        this.setCell(x,y," ",this.map);
                    if (!isNaN(this.pathMap[y][x]))
                        this.setCell(x,y,"",this.pathMap);
                }
        },
        clearMap() {
            this.map = [];
            this.pathMap = []
            for (let y = 0; y < this.mapHeight; y++) {
                this.map.push([]);
                this.pathMap.push([]);
                for (let x = 0; x < this.mapWidth; x++) {
                    this.map[y].push("");
                    this.pathMap[y].push("");
                }
            }
        },
        setDrag(x,y,val) {
            if (this.draggable.indexOf(this.currSelection) != -1) {
                this.dragging = val;
                if (val)
                    this.cellClick(x,y);
            }
        },
        dragEvent(x,y) {
            if (this.dragging) {
                this.cellClick(x,y);
            }
        },
        isEmpty(x,y) {
            return !isNaN(this.map[y][x]) || this.map[y][x] == " ";
        },
        onBoard(x,y) {
            return x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight;
        },
        getColor(x,y) {
            if (isNaN(this.map[y][x]))
                return "rgba(0,0,0,0)";
            else
                return "rgba(255,0,0," + this.map[y][x] / this.maxVal + ")"
        },
        changeDirSelection() {
            if (this.selectedDir == cardinalDirs)
                this.selectedDir = diagonalDirs;
            else
                this.selectedDir = cardinalDirs;
            this.generate();
        }
    },
    created: function() {
        this.clearMap();
    }
}
</script>

<style>
.clickable {
    cursor:pointer;
    user-select: none;
}

td {
    border: 1px solid black;
    height: 2rem;
    width: 2rem;
    text-align: center;
}

#selection-container {
    display: inline-block;
}

.selection {
    float: left;
    width: 1.2rem;
    height: 1.2rem;
    margin: 0.5rem;
    border: 2px solid black;
    text-align: center;
}

.selected {
    font-weight: bold;
    border: 3px solid gold;
}

.path-node {
    width: 1rem;
    height: 1rem;
    border-radius: 1rem;
    background-color: blue;
}
</style>
