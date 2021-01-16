<template>
    <div>
        <ul>
            <li
                v-for="section in sections"
                v-bind:key="section"
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
}
</style>