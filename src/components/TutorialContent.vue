<template>
    <div>
        <TutorialPageEntities v-if="currentSection == 'Entities'"/>
        <TutorialPageTerrain  v-if="currentSection == 'Terrain'"/>
        <TutorialPageControls  v-if="currentSection == 'Controls'"/>
        <TutorialPageSettings  v-if="currentSection == 'Settings'"/>
    </div>
</template>

<script>
import TutorialPageEntities from "./TutorialPageEntities.vue"
import TutorialPageTerrain from "./TutorialPageTerrain.vue"
import TutorialPageControls from "./TutorialPageControls.vue"
import TutorialPageSettings from "./TutorialPageSettings.vue"

export default {
    props: {
        currentSection: {
            type: String,
            required: true
        }
    },
    components: {
        TutorialPageEntities,
        TutorialPageTerrain,
        TutorialPageControls,
        TutorialPageSettings
    }
};
</script>

<style scoped>

</style>