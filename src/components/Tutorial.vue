<template>
    <div 
        v-if="tutorialOpen"
        id="tutorial-container"
    >
        <div id="tutorial-content-container">
            <h1>
                Tutorial
            </h1>
            <button 
                @click="closeTutorial"
                id="close-button"
            >
                &#10005;
            </button>
            <TableOfContents
                :sections="sections"
            />
            <div id="tutorial-control-container">
                <button>Back</button>
                <button>Next</button>
                <button @click="closeTutorial">Skip</button>
            </div>
        </div>
        <div id="tutorial-shade"></div>
    </div>
</template>

<script>
import TableOfContents from './TableOfContents.vue'
export default {
    props: {
        tutorialOpen: {
            type: Boolean,
            required: true
        }
    },
    components: {
        TableOfContents
    },
    data() {
        return {
            sections: [
                "Part 1",
                "Part 2"
            ]
        }
	},
	methods: {
        closeTutorial() {
            this.$emit("closeTutorial");
        }
	}
};
</script>

<style scoped>
h1 {
    text-align: center;
}

#tutorial-container, #tutorial-shade {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
}

#tutorial-shade {
    background-color: rgba(29, 28, 28, 0.733);
}

#tutorial-content-container {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    background-color: white;
    width: 50%;
    height: 50%;
}

#tutorial-control-container {
    position: absolute;
    right: 2rem;
    bottom: 2rem;
}

#close-button {
    position: absolute;
    right: 0.5rem;
    top: 1rem;
}
</style>