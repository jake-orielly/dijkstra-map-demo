<template>
    <div>
        <p class="title"> Settings I</p>
        <p>
            The settings panel offers a number of options for customizing what information is displayed.
            Play around with different settings to learn more about how different aspects of the simulation work.
        </p>
        <p>
            <span class="emphasis">Showing/Hiding Path</span>: Toggle whether agent paths are shown.
            Dwarves in blue, monsters in red, these paths show where agents are planning to go,
            and update as the world changes.
        </p>
        <p>
            <span class="emphasis">Showing/Hiding Values</span>: Shows a numerical value for each square.
            The square is a function of the distance to the nearest treasure, taking into account the movement
            cost of terrain accross the shortest path. The closer the treasure the lower the value. Near the
            treasure chest, these values may even be negative.
        </p>
    </div>
</template>

<style scoped src='../css/tutorialpage.css'></style>