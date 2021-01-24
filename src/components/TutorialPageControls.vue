<template>
    <div>
        <p class="title">Controls</p>
        <p>
            <span class="text-block">
                You can control the speed of the simulation using the 
                <span class="emphasis">pause</span> (<font-awesome-icon :icon="['fas', 'pause']" />),
                <span class="emphasis">play</span> (<font-awesome-icon :icon="['fas', 'play']" />), 
                and <span class="emphasis">fast forward</span> (<font-awesome-icon :icon="['fas', 'forward']" />) buttons.
            </span>
        </p>
        <p>
            <span class="text-block">
                The <span class="emphasis">Step</span> button moves the simulation forward by a single step. Note: because the default plains terrain has a
                move cost of 2, agents on plains will only move once every 2 steps.
            </span>
        </p>
        <p>
            <span class="text-block">
                The <span class="emphasis">Clear</span> button removes all agents and resets all terrain. Be careful!
            </span>
        </p>
    </div>
</template>

<style scoped src='../css/tutorialpage.css'></style>