import Vue from 'vue';

const cardinalDirs = [
    [1,0],
    [0,1],
    [-1,0],
    [0,-1]
];

export default {
    data: function() {
        return {
            mapHeight:10,
            mapWidth:14,
            map:[],
            selections:["P","G","W"," "],
            draggable: ["W"," "],
            currSelection:undefined,
            maxVal:0,
            dragging: false
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
                        for (let dir of cardinalDirs) {
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
                    for (let dir of cardinalDirs) {
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
    },
    created: function() {
        this.clearMap();
    }
}