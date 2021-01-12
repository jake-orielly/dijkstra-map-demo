<template>
  <div>
    <div id="board-container">
        <GameBoard
            ref="gameBoard"
            :currSelection="currSelection"
            :selectedDir="selectedDir"
            :showingPath="showingPath"
            :showingValues="showingValues"
            :showingColors="showingColors"
            :showingTerrain="showingTerrain"
        />
    </div>
    <div id="ui-container">
        <ExpandableMenuRow
            :label="'Entities'"
        >
            <TileTool 
                v-for="item in entityTools" 
                v-bind:key="item"
                :item="item"
                :isSelected="currSelection == item"
                @clicked="setSelection"
                class="clickable"
            >
                <span>{{item}}</span>
            </TileTool>
        </ExpandableMenuRow>
        <ExpandableMenuRow
            :label="'Terrain'"
        >
            <TileTool 
                v-for="item in terrainTools" 
                v-bind:key="item"
                :item="item"
                :isSelected="currSelection == item"
                @clicked="setSelection"
                class="clickable"
            >
                <img 
                    :src="getImgUrl(item)"
                    v-bind:alt="item"
                    class="terrain-img"
                >
            </TileTool>
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
            <Toggle 
                @toggle="changeDirSelection" 
                :onLabel="'Cardinal'"
                :offLabel="'Diagonal'"
            />
            <Toggle 
                @toggle="toggleShowingPath" 
                :onLabel="'Showing Path'"
                :offLabel="'Hiding Path'"
            />
            <Toggle 
                @toggle="toggleShowingValues" 
                :onLabel="'Showing Values'"
                :offLabel="'Hiding Values'"
            />
            <Toggle 
                @toggle="toggleShowingColors" 
                :onLabel="'Showing Colors'"
                :offLabel="'Hiding Colors'"
            />
            <Toggle 
                @toggle="toggleShowingTerrain" 
                :onLabel="'Showing Terrain'"
                :offLabel="'Hiding Terrain'"
            />
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
        Toggle,
    },
    data: function() {
        return {
            entityTools:["A","G","W"," "],
            terrainTools:["road","plains","mountain"],
            selectedDir: utilities.cardinalDirs,
            currSelection:undefined,
            showingPath: true,
            showingValues: true,
            showingColors: true,
            showingTerrain: true
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
        },
        toggleShowingPath() {
            this.showingPath = !this.showingPath;
        },
        toggleShowingValues() {
            this.showingValues = !this.showingValues;
        },
        toggleShowingColors() {
            this.showingColors = !this.showingColors;
        },
        toggleShowingTerrain() {
            this.showingTerrain = !this.showingTerrain;
        },
        getImgUrl(item) {
           return require(`./assets/${item}.png`)
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

#ui-container {
    width: 20%;
}

.clickable {
    cursor:pointer;
    user-select: none;
}

button {
    font-size: 2rem;
}

.terrain-img {
    height: 3rem;
    width: 3rem;
}
</style>
