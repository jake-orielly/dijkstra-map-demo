<template>
  <div>
    <div id="board-container">
        <GameBoard
            ref="gameBoard"
            :currSelection="currSelection"
            :selectedDir="selectedDir"
        />
    </div>
    <div id="ui-container">
        <ExpandableMenuRow
            :label="'Entities'"
        >
            <TileTool 
                v-for="item in selections" 
                v-bind:key="item"
                :item="item"
                :isSelected="currSelection == item"
                @clicked="setSelection"
                class="clickable"
            />
        </ExpandableMenuRow>
        <ExpandableMenuRow
            :label="'Actions'"
        >
            <button @click="$refs.gameBoard.step()">Step</button>
            <button @click="$refs.gameBoard.clearMap()">Clear</button>
        </ExpandableMenuRow>
        <ExpandableMenuRow
            :label="'Settings'"
        >
            <Toggle/>
        </ExpandableMenuRow>
    </div>
  </div>
</template>

<script src="./main.js">
</script>

<script>
import GameBoard from './components/GameBoard.vue'
import ExpandableMenuRow from './components/ExpandableMenuRow.vue'
import TileTool from './components/TileTool.vue'
import Toggle from './components/Toggle.vue'
import utilities from "./js/utilities.js"

export default {
  name: 'App',
  components: {
        GameBoard,
        ExpandableMenuRow,
        TileTool,
        Toggle
    },
    data: function() {
        return {
            selections:["A","G","W"," "],
            selectedDir: utilities.cardinalDirs,
            currSelection:undefined,
        }
    },
    methods: {
        setSelection(selection) {
            this.currSelection = selection;
        },
        changeDirSelection() {
            if (this.selectedDir == utilities.cardinalDirs)
                this.selectedDir = utilities.diagonalDirs;
            else
                this.selectedDir = utilities.cardinalDirs;
            this.generate();
        }
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');

* {
    font-family: 'Montserrat', sans-serif;
}

#board-container, #ui-container {
    width: auto;
    float: left;
}

#board-container {
    margin-right: 2rem;
}

.clickable {
    cursor:pointer;
    user-select: none;
}

button {
    font-size: 2rem;
}
</style>
