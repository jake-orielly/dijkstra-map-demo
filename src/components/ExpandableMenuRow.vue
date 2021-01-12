<template>
    <div>
        <p 
            @click="toggleExpand"
            class="clickable"    
        >
            {{label}}
            <span v-if="expanded">&#9650;</span>
            <span v-if="!expanded">&#9660;</span>
        </p>
        <div v-if="expanded">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            expanded: false
        }
    },
	methods: {
        toggleExpand() {
            this.expanded = !this.expanded;
        }
    }
};
</script>

<style scoped>
p {
    font-size: 2rem;
}
</style>