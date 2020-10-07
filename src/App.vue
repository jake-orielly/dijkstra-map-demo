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
            selections:["P","G","W"," "],
            draggable: ["W"," "],
            currSelection:undefined,
            maxVal:0,
            dragging: false,
            selectedDir: cardinalDirs
        }
    },
    methods: {
        cellClick(x,y) {
            this.setCell(x,y,this.currSelection);
            this.generate();
        },
        setSelection(selection) {
            this.currSelection = selection;
        },
        generate() {
            let toExpand = [];
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
            this.expand(toExpand);
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
        softSet(x,y,val) {
            if (
                (!isNaN(this.map[y][x]) && val < this.map[y][x])
                || this.map[y][x] == " "
            ){
                this.setCell(x,y,val);
                return true;
            }
            else
                return false;
        },
        setCell(x,y,val) {
            if (this.map[y][x] != val) {
                let row = this.map[y]
                row[x] = val;
                this.$set(this.map, y, row);
            }
        },
        resetMap() {
            for (let y = 0; y < this.mapHeight; y++)
                for (let x = 0; x < this.mapWidth; x++)
                    if (!isNaN(this.map[y][x]))
                        this.setCell(x,y," ");
        },
        clearMap() {
            this.map = [];
            for (let y = 0; y < this.mapHeight; y++) {
                this.map.push([]);
                for (let x = 0; x < this.mapWidth; x++) {
                    this.map[y].push(" ");
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
</style>
