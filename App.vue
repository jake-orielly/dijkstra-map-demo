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
  </div>
</template>

<script src="./src/main.js">
</script>

<style src="./app.css"></style>