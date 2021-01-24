<template>
    <div 
        class="tile-tool"
        @click="clicked"
        :class="{'selected' : isSelected}"
    >
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: String,
            required: true
        },
        isSelected: {
            type: Boolean,
            required: true
        }
    },
	methods: {
        clicked() {
            this.$emit("clicked", this.item)
        }
	}
};
</script>

<style lang="scss" scoped>
.tile-tool {
    float: left;
    width: 3.2rem;
    height: 3.2rem;
    margin: 0.5rem;
    font-size: 2rem;
    text-align: center;

    img {
        border: 2px solid black;
        box-shadow: 1px 1px 2px #868181;
    }

    &.selected {
        img {
            font-weight: bold;
            border: 3px solid gold;
        }
    }
}

@media(max-width:1300px) {
    .tile-tool {
        width: 2.2rem;
        height: 2.2rem;
    }
}
</style>