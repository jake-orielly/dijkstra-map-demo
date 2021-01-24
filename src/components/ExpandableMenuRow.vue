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
        <div 
            v-if="expanded"
            class="row-content"
        >
            <slot></slot>
        </div>
    </div>
</template>

<script>
import { EventBus } from '../event-bus.js';

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
    mounted() {
        EventBus.$on('rowExpanded', this.contractOther);
    },
	methods: {
        toggleExpand() {
            this.expanded = !this.expanded;
            if (this.expanded)
                EventBus.$emit('rowExpanded', this.label);
        },
        contractOther(label) {
            if (this.label != label)
                this.expanded = false;
        }
    }
};
</script>

<style scoped>
p {
    font-size: 2rem;
}

.row-content {
    display: inline-block;
}

@media(max-width:1300px) {
    p {
        font-size: 1.75rem;
    }
}
</style>