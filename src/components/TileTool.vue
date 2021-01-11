<template>
    <div 
        class="tile-tool"
        @click="clicked"
        :class="{'selected' : isSelected}"
    >
        {{item}}
    </div>
</template>

<script>
export default {
    props: [
        'item',
        'isSelected'
    ],
	methods: {
        clicked() {
            this.$emit("clicked", this.item)
        }
	}
};
</script>

<style scoped>
.tile-tool {
    float: left;
    width: 3.2rem;
    height: 3.2rem;
    margin: 0.5rem;
    font-size: 2rem;
    border: 2px solid black;
    text-align: center;
}

.selected {
    font-weight: bold;
    border: 3px solid gold;
}
</style>