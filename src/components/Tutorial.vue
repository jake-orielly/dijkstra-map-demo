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
            <div id="tutorial-body-container">
                <TableOfContents
                    :sections="sections"
                    :currentSection="currentSection"
                    @sectionClick="setSelection"
                />
                <TutorialContent
                    :currentSection="currentSection"
                />
            </div>
            <div id="tutorial-control-container">
                <div></div>
                <div>
                    <button 
                        v-if="currentSectionNum > 0"
                        @click="changeSection(-1)"
                    >
                        Back
                    </button>
                </div>
                <div>
                    <button 
                        v-if="currentSectionNum < sections.length - 1"
                        @click="changeSection(1)"
                    >
                        Next
                    </button>
                    <button 
                        v-if="currentSectionNum == sections.length - 1"
                        @click="closeTutorial(1)"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
        <div id="tutorial-shade"></div>
    </div>
</template>

<script>
import TableOfContents from './TableOfContents.vue'
import TutorialContent from './TutorialContent.vue'

export default {
    props: {
        tutorialOpen: {
            type: Boolean,
            required: true
        }
    },
    components: {
        TableOfContents,
        TutorialContent
    },
    data() {
        return {
            sections: [
                "Introduction",
                "Entities",
                "Terrain",
                "Controls",
                "Settings I",
                "Settings II",
                "Thanks!"
            ],
            currentSectionNum: 0,
        }
	},
    computed: {
        currentSection() {
            return this.sections[this.currentSectionNum];
        }
    },
	methods: {
        changeSection(val) {
            this.currentSectionNum += val;
        },
        setSelection(val) {
            this.currentSectionNum = val;
        },
        closeTutorial() {
            this.$emit("closeTutorial");
            this.$cookies.set('tutorialComplete',true);
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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    background-color: white;
    width: 70%;
    height: 90%;
}

#tutorial-body-container {
    display: grid;
    grid-template-columns: 20% 70%;
}

#tutorial-control-container {
    position: absolute;
    display: grid;
    grid-template-columns: 80% 10% 10%;
    width: 100%;
    bottom: 2rem;
}

#close-button {
    position: absolute;
    right: 0.5rem;
    top: 1rem;
}
</style>