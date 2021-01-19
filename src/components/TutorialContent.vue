<template>
    <div>
        <TutorialPageIntroduction v-if="currentSection == 'Introduction'"/>
        <TutorialPageEntities v-if="currentSection == 'Entities'"/>
        <TutorialPageTerrain  v-if="currentSection == 'Terrain'"/>
        <TutorialPageControls  v-if="currentSection == 'Controls'"/>
        <TutorialPageSettings  v-if="currentSection == 'Settings I'"/>
        <TutorialPageSettings2  v-if="currentSection == 'Settings II'"/>
        <TutorialPageThankYou  v-if="currentSection == 'Thanks!'"/>
    </div>
</template>

<script>
import TutorialPageIntroduction from "./TutorialPageIntroduction.vue"
import TutorialPageEntities from "./TutorialPageEntities.vue"
import TutorialPageTerrain from "./TutorialPageTerrain.vue"
import TutorialPageControls from "./TutorialPageControls.vue"
import TutorialPageSettings from "./TutorialPageSettings.vue"
import TutorialPageSettings2 from "./TutorialPageSettings2.vue"
import TutorialPageThankYou from "./TutorialPageThankYou.vue"

export default {
    props: {
        currentSection: {
            type: String,
            required: true
        }
    },
    components: {
        TutorialPageIntroduction,
        TutorialPageEntities,
        TutorialPageTerrain,
        TutorialPageControls,
        TutorialPageSettings,
        TutorialPageSettings2,
        TutorialPageThankYou
    }
};
</script>
