<template>
    <td 
        class="clickable"
        :style="{ backgroundColor: getColor(),
        border: (showingGridLines ? '1px solid black' : '')}"
        @mousedown="$emit('setDrag',x, y, true)"
        @mouseup="$emit('setDrag',x, y, false); $emit('click', x, y)"
        @mouseover="$emit('dragEvent',x, y)"
    >
        <img 
            v-if="tile.entity"
            :src="tile.entity.img"
            class="entity-img"
        >
        <img 
            v-for="terrain in tile.terrain.slice().reverse().filter(_ => showingTerrain == true)"
            v-bind:key="`${x}-${y}-${terrain}`"
            :src="getImgUrl(terrain)"
            class="terrain-img"
        >
        <span
            v-if="shouldShow()"
        >
            {{tile.value}}
        </span>
        <div class="path-node-container">
            <div 
                v-for="node in showingPath"
                v-bind:key="`${x}-${y}-${node}`"
                class="path-node"
                :class="[getPathColor(node)]"
            ></div>
        </div>
    </td>
</template>

<script>
import utilities from "../js/utilities.js"

export default {
    props: {
        tile: {
            type: Object,
            required: true
        },
        x: {
            type: Number,
            required: true
        },
        y: {
            type: Number,
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
        showingPath: {
            type: Array,
            required: true
        },
        showingTerrain: {
            type: Boolean,
            required: true
        },
        showingGridLines: {
            type: Boolean,
            required: true
        },
        maxVal: {
            type: Number,
            required: true
        },
        rgbMapColor: {
            type: Array,
            required: true
        }
    },
	methods: {
        shouldShow() {
            if (this.tile.terrain[0].substr(0,4) == "wall" || this.tile.entity)
                return false;
            return this.showingValues || isNaN(this.tile.value)
        },
        getColor() {
            if (!this.showingColors || this.tile.value == " ")
                return "rgba(0,0,0,0)";
            else
                return `rgba(${this.rgbMapColor.join(",")},${(this.tile.value / this.maxVal) * 0.7})`;
        },
        getImgUrl(item) {
            return utilities.getImgUrl(item);
        },
        getPathColor(node) {
            return `${node}-path-node`
        }
	}
};
</script>

<style scoped>

img, td {
    height: 2.5rem;
    width: 2.5rem;
}

td {
    position: relative;
    font-size: 2rem;
    text-align: center;
    margin: 0;
    padding: 0;
}

span {
    z-index: 3;
    font-size: 1.25rem;
}

.terrain-img, .entity-img {
    position: absolute;
    top: 0;
    left: 0;
}

.terrain-img {
    z-index: -1;
}

.entity-img {
    z-index: 2;
}


.path-node-container {
    position: absolute;
    bottom: 0rem;
    z-index: 2;
}

.path-node {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border-radius: 1rem;
    margin-bottom: -0.5rem;
    margin-right: -0.5rem;
}

.dwarf-path-node {
    background-color: blue;
}

.monster-path-node {
    background-color: red;
    left: 0.5rem;
}
</style>