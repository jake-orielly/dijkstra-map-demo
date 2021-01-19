<template>
    <div>
        <p class="title"> Terrain </p>
        <p>
            There are 4 types of terrain. All except walls can be traversed, though at different speeds.
            The higher the cost, the longer it takes agents to cross, and they will take this into account 
            when planning their routes. Tip: You can click and drag to draw to easily paint multiple tiles.
        </p>
        <p>
            <img src="../assets/road.png">
            <span class="text-block">
                <span class="emphasis">Road</span>:
                A clear road for easy travel. The fastest type of terrain, with a cost of 1.
            </span>
        </p>
        <p>
            <img src="../assets/plains.png">
            <span class="text-block">
                <span class="emphasis">Plains</span>:
                Gentle breezy plains. The default terrain, with a cost of 2.
            </span>
        </p>
        <p>
            <img src="../assets/mountain.png">
            <span class="text-block">
                <span class="emphasis">Mountain</span>:
                A towering mountain. The most challenging terrain, with a cost of 3.
            </span>
        </p>
        <p>
            <img src="../assets/wall.png">
            <span class="text-block">
                <span class="emphasis">Walls</span>:
                Sturdy walls. Completely impassible. Useful for creating mazes!
            </span>
        </p>
    </div>
</template>

<style scoped src='../css/tutorialpage.css'></style>