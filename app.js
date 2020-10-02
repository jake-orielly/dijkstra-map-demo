
var app = new Vue({ 
    el: '#app',
    data: {
        mapHeight:7,
        mapWidth:7,
        map:[],
        selections:["P","G","W"],
        currSelection:0
    },
    methods: {
        cellClick(x,y) {
            let row = this.map[y]

            if (row[x] == this.currSelection)
                row[x] == 0;
            else
                row[x] = this.currSelection;
                
            Vue.set(app.map, y, row)
        },
        setSelection(selection) {
            this.currSelection = selection;
        }
    },
    created: function() {
        for (let y = 0; y < this.mapHeight; y++) {
            this.map.push([]);
            for (let x = 0; x < this.mapWidth; x++) {
                this.map[y].push(0);
            }
        }
    }
});