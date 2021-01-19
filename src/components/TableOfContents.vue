<template>
    <div>
        <ul>
            <li
                v-for="(section, ind) in sections"
                v-bind:key="section"
                :class="{'active-section' : currentSection == section}"
                @click="$emit('sectionClick',ind)"
            >
                {{section}}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        sections: {
            type: Array,
            required: true
        },
        currentSection: {
            type: String,
            required: true
        }
    },
    data() {
        return {
        }
    },
	methods: {

    }
};
</script>

<style scoped>
ul {
    font-size: 1.5rem;
    list-style: none;
    cursor: pointer;
    user-select: none;
}

li {
    margin-bottom: 0.5rem;
}

.active-section {
    color: blue;
    font-weight: bold;
}
</style>