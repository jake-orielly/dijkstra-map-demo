<template>
    <div>
        <p 
            @click="toggleExpand"
            class="clickable"    
        >Label</p>
        <div v-if="expanded">
            Content
        </div>
    </div>
</template>

<script>
export default {
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
</style>