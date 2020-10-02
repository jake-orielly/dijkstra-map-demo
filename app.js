const cardinalDirs = [
    [1,0],
    [0,1],
    [-1,0],
    [0,-1]
]
var app = new Vue({ 
    el: '#app',
    data: {
        mapHeight:7,
        mapWidth:10,
        map:[],
        selections:["P","G","W"],
        currSelection:0
    },
    methods: {
        cellClick(x,y) {
            if (this.map[y][x] == this.currSelection)
                this.setCell(x,y," ")
            else
                this.setCell(x,y,this.currSelection);
        },
        setSelection(selection) {
            this.currSelection = selection;
        },
        generate() {
            let toExpand = [];
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
        },
        expand(toExpand) {
            let curr;
            while (toExpand.length) {
                curr = toExpand.pop();
                for (let dir of cardinalDirs) {
                    let newX = curr[0] + dir[0];
                    let newY = curr[1] + dir[1];
                    if (this.onBoard(newX,newY)) {
                        if (this.softSet(newX,newY,this.map[curr[1]][curr[0]] + 1))
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
            let row = this.map[y]
            row[x] = val;
            Vue.set(app.map, y, row)
        },
        onBoard(x,y) {
            return x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight;
        }
    },
    created: function() {
        for (let y = 0; y < this.mapHeight; y++) {
            this.map.push([]);
            for (let x = 0; x < this.mapWidth; x++) {
                this.map[y].push(" ");
            }
        }
    }
});