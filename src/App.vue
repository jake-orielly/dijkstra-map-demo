<template>
  <div>
    <Tutorial
        :tutorialOpen="showingTutorial"
        @closeTutorial="showingTutorial = false"
    />
    <div id="board-container">
        <GameBoard
            ref="gameBoard"
            :currSelection="currSelection"
            :showingPath="showingPath"
            :showingValues="showingValues"
            :showingColors="showingColors"
            :showingTerrain="showingTerrain"
            :showingGridLines="showingGridLines"
            :mapColor="mapColor"
        />
    </div>
    <div id="ui-container">
        <ExpandableMenuRow
            :label="'Entities'"
        >
            <TileTool 
                v-for="item in entityTools" 
                v-bind:key="item.type"
                :item="item.type"
                :isSelected="currSelection.value == item.type"
                @clicked="setSelection(item.type,'entity')"
                class="clickable"
            >
                <img 
                    :src="item.img"
                    v-bind:alt="item.type"
                    class="terrain-img"
                >
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
            :label="'Controls'"
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
            <br>
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
            <span class="color-label">
                <input type="color" v-model="mapColor">
                Value Color
            </span>
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
        <p
            @click="showingTutorial = true"
            class="clickable"
            id="tutorial-link"
        >
            Tutorial
            <span>&#9432;</span>
        </p>
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
import Tutorial from './components/Tutorial'

import utilities from './js/utilities.js'
import goals from './js/goals.js'

export default {
  name: 'App',
  components: {
        GameBoard,
        ExpandableMenuRow,
        Slider,
        TileTool,
        Toggle,
        Tutorial
    },
    data: function() {
        return {
            //...Object.keys(goals),
            entityTools:[
                {
                    type:"dwarf",
                    img:this.getImgUrl("dwarf")
                },
                {
                    type:"monster",
                    img:this.getImgUrl("monster")
                },
                ...Object.keys(goals).map(
                    item => {
                        return {
                            type:item,
                            img:this.getImgUrl(item)
                }}),
                {
                    type:"erase",
                    img:this.getImgUrl("erase")
                },
            ],
            terrainTools:["road","plains","mountain", "wall","erase"],
            currSelection: {
                value: undefined, 
                type: undefined
            },
            showingTutorial: true,
            showingPath: true,
            showingValues: true,
            showingColors: false,
            showingTerrain: true,
            showingGridLines: false,
            gameTick: undefined,
            mapColor: "#ff0000",
        }
    },
    mounted() {
        if (this.$cookies.get('tutorialComplete'))
            this.showingTutorial = false;
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
            return utilities.getImgUrl(item);
        }
    }
}
</script>

<style lang="scss">
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

.color-label {
    font-size: 2rem;
}

button {
    font-size: 2rem;
    border: 2px solid black;
    border-radius: 5px;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    user-select: none;
}

.terrain-img {
    height: 2.5rem;
    width: 2.5rem;
}

#tutorial-link {
    font-size: 2rem;

    span {
        font-weight: bold;
    }
}
</style>
