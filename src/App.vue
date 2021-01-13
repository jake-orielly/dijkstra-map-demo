<template>
  <div>
    <div id="board-container">
        <GameBoard
            ref="gameBoard"
            :currSelection="currSelection"
            :showingPath="showingPath"
            :showingValues="showingValues"
            :showingColors="showingColors"
            :showingTerrain="showingTerrain"
            :showingGridLines="showingGridLines"
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
                :isSelected="currSelection.value == item"
                @clicked="setSelection(item,'entity')"
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
                :isSelected="currSelection.value == item"
                @clicked="setSelection(item,'terrain')"
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
            <button 
                @click="setSpeed('pause')"
                class="button-selected"
            >
                <font-awesome-icon :icon="['fas', 'pause']" />
            </button>
            <button 
                @click="setSpeed('play')"
            >
                <font-awesome-icon :icon="['fas', 'play']" />
            </button>
            <button 
                @click="setSpeed('forward')"
            >
                <font-awesome-icon :icon="['fas', 'forward']" />
            </button>
            <button @click="$refs.gameBoard.step()">Step</button>
            <button @click="$refs.gameBoard.clearMap()">Clear</button>
        </ExpandableMenuRow>
        <ExpandableMenuRow
            :label="'Settings'"
        >
            <Toggle 
                @toggle="toggleShowingPath" 
                :onLabel="'Showing Path'"
                :offLabel="'Hiding Path'"
                :defaultValue="showingPath"
            />
            <Toggle 
                @toggle="toggleShowingValues" 
                :onLabel="'Showing Values'"
                :offLabel="'Hiding Values'"
                :defaultValue="showingValues"
            />
            <Toggle 
                @toggle="toggleShowingColors" 
                :onLabel="'Showing Colors'"
                :offLabel="'Hiding Colors'"
                :defaultValue="showingColors"
            />
            <Toggle 
                @toggle="toggleShowingTerrain" 
                :onLabel="'Showing Terrain'"
                :offLabel="'Hiding Terrain'"
                :defaultValue="showingTerrain"
            />
            <Toggle 
                @toggle="toggleShowGridLines" 
                :onLabel="'Showing Grid Lines'"
                :offLabel="'Hiding Grid Lines'"
                :defaultValue="showingGridLines"
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
import Slider from './components/Slider.vue'
import TileTool from './components/TileTool.vue'
import Toggle from './components/Toggle.vue'

export default {
  name: 'App',
  components: {
        GameBoard,
        ExpandableMenuRow,
        Slider,
        TileTool,
        Toggle,
    },
    data: function() {
        return {
            entityTools:["A","G","E"],
            terrainTools:["road","plains","mountain", "wall"],
            currSelection: {
                value: undefined, 
                type: undefined
            },
            showingPath: true,
            showingValues: false,
            showingColors: true,
            showingTerrain: true,
            showingGridLines: false,
            gameTick: undefined,
        }
    },
    methods: {
        setSelection(selection, type) {
            this.currSelection = {
                value: selection,
                type: type
            };
        },
        setSpeed(speed) {
            clearInterval(this.gameTick)
            if (speed == "play")
                this.gameTick = setInterval(this.$refs.gameBoard.step, 500);
            else if (speed == "forward")
                this.gameTick = setInterval(this.$refs.gameBoard.step, 150);
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
        toggleShowGridLines() {
            this.showingGridLines = !this.showingGridLines;
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
    width: 25%;
}

.clickable {
    cursor:pointer;
    user-select: none;
}

button {
    font-size: 2rem;
    border: 2px solid black;
    border-radius: 5px;
}

.terrain-img {
    height: 3rem;
    width: 3rem;
}
</style>
